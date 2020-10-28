const request = require('superagent');
const { parse } = require('node-html-parser');
const { camelCase } = require('lodash')
const fs = require("fs")
const characterData = require("../../data/character")

// scrape each character page
async function scrapePage(character) {
   const url = 'https://strangerthings.fandom.com/wiki/' + character

   const response = await request.get(url)
   const data = await response.text
   const parseData = await parse(data)
   
   return parseData
}

// get character name from its page
async function getName(html) {
   return html.querySelectorAll('.pi-item.pi-item-spacing.pi-title').map(node => node.rawText);
}
   
// get all the labels for bio info, physical info & portrayal
async function getSummaryLabels(html) {   
   return html.querySelectorAll('h3.pi-data-label').map(node => node.structuredText)   
}

// get all the values for bio info, physical info & portrayal
async function getSummaryValues(html) {
   return html.querySelectorAll('div.pi-data-value')
}

// get the link for character's picture 
async function getPicture(html) {
   return html.querySelectorAll('.pi-image-thumbnail')[0].getAttribute('src')
}

async function getDetails(character) {
   const parseData = await scrapePage(character)
   const summaryLabels = await getSummaryLabels(parseData)
   const summaryValues = await getSummaryValues(parseData)
   const name = await getName(parseData)
   const picture = await getPicture(parseData)

   let details = new Object()
   details['name'] = name.toString()
   details['picture'] = picture

   if (summaryLabels.length === summaryValues.length) {      
      for (let i = 0; i < summaryLabels.length; i++) {
         const label = camelCase(summaryLabels[i])
         const structure = summaryValues[i].innerHTML
         let value = summaryValues[i].rawText

         if (label == 'status') {
            details[label] = removeBrackets(value, '[')
         } 
         else if (label == 'born') {
            details[label] = removeBrackets(value, '[')
         } 
         else if (label == 'age') {
            // need to remove 2 types of brackets
            value = removeBrackets(value, '[')
            details[label] = removeBrackets(value, '(')
         } 
         else if (label == 'aliases') { 
            details[label] = splitData(structure)
         } 
         else if (label == 'relationshipStatus') {
            details[label] = value
         } 
         else if (label == 'family') {
            details[label] = splitData(structure)
         } 
         else if (label == 'otherRelations') {
            details[label] = splitData(structure)
         } 
         else if (label == 'affiliation') {
            details[label] = splitData(structure)
         } 
         else if (label == 'occupation') {
            details[label] = splitData(structure)
         } 
         else if (label == 'gender') {
            details[label] = value
         } 
         else if (label == 'portrayedBy') {
            details[label] = splitData(structure)
         } 
         else {
            //console.log(label + " null")
         }
      }  
   }

   details = checkProperty(details)
   console.log(details)
   //writeDataToFile(details)
}

function removeBrackets(str, bracketType) {
   if (str.includes(bracketType)) {
      const n = str.indexOf(bracketType)
      str = str.substring(0, n).trim()
   }  
   return str
}

function splitData(string) {
   if (string.includes('<br>')) {
      const arrayStr = string.split('<br>').map(str => removeHref(str).trim())
      return arrayStr
   } else if (string.includes('<p>')) {
      const arrayStr = string.split('<p>').map(str => removeHref(str).trim())
      return arrayStr
   } else {
      string = removeHref(string).trim()
      return string
   }
}

function removeTags(str) {
   str = str.replace(/[""|”]/g, "")
   str = str.replace('<p>', "")
   str = str.replace('</p>', "")
   str = str.replace('</a>', "")
   str = str.replace('<small>', "")
   str = str.replace('</small>', "")

   return str
}

function removeHref(str) {
   str = removeTags(str)
   
   const start = str.indexOf('<a')
   const end = str.indexOf('>')
   const s = str.substring(start, end+1)

   str = str.replace(s, "")

   return str
}

// some characters has unmentioned details, so we need to check and assign accordingly 
function checkProperty(object) {
   if (!object.hasOwnProperty('age')) {
      object['age'] = 'not mentioned'
   }
   if (!object.hasOwnProperty('relationshipStatus')) {
      object['relationshipStatus'] = 'not mentioned'
   } //aliases, family, affiliation
   if (!object.hasOwnProperty('aliases')) {
      object['aliases'] = 'not mentioned'
   }
   if (!object.hasOwnProperty('family')) {
      object['family'] = 'not mentioned'
   }
   if (!object.hasOwnProperty('affiliation')) {
      object['affiliation'] = 'not mentioned'
   }

   return object
}

// write characters data to a json file
function writeDataToFile(details) {
   characterData.push(details)

   fs.writeFile("./data/character.json", JSON.stringify(characterData), err => {
      if (err) throw err

      console.log("Done")
   })
}
   
module.exports = getDetails