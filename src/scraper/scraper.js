const request = require('superagent');
const { parse } = require('node-html-parser');
const { camelCase } = require('lodash')
const fs = require("fs")
const characterData = require("../../data/character")

// scrape each character page
async function scraper(character) {
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

async function scrapeData(character) {
   const parseData = await scraper(character)

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
         let value = summaryValues[i].rawText
         const structure = summaryValues[i].innerHTML

         if (label == 'status') {
            details[label] = value
         } 
         else if (label == 'born') {
            if (value.includes('[')) {
               const n = value.indexOf('[')
               value = value.substring(0, n)
            }
            details[label] = value
         } 
         else if (label == 'age') {
            details[label] = value.substring(0,2)
         } 
         else if (label == 'aliases') {            
            const reformatted = structure.split('<br>').map(str => removeTags(str).trim())
            details[label] = reformatted
         } 
         else if (label == 'relationshipStatus') {
            details[label] = value
         } 
         else if (label == 'family') {
            const reformatted = structure.split('<br>').map(str => removeHref(str).trim())
            details[label] = reformatted
         } 
         else if (label == 'otherRelations') {
            const reformatted = structure.split('<br>').map(str => removeHref(str).trim())
            details[label] = reformatted
         } 
         else if (label == 'affiliation') {
            const reformatted = structure.split('<br>').map(str => removeHref(str).trim())
            details[label] = reformatted
         } 
         else if (label == 'occupation') {
            if (structure.includes('<br>')) {
               const reformatted = structure.split('<br>').map(str => removeHref(str).trim())
               details[label] = reformatted
            }
            else {
               details[label] = value
            }
         } 
         else if (label == 'gender') {
            details[label] = value
         } 
         else if (label == 'portrayedBy') {
            if (structure.includes('<br>')) {
               const reformatted = structure.split('<br>').map(str => removeHref(str).trim())
               details[label] = reformatted
            }
            else {
               details[label] = value
            }
         } 
         else {
            //console.log(label + " null")
         }
      }  
   }

   if(!details.hasOwnProperty('relationshipStatus')) {
      details['relationshipStatus'] = 'undefined'
   } //aliases, family, affiliation
   
   console.log(details)

   /* characterData.push(details)

   fs.writeFile("./data/character.json", JSON.stringify(characterData), err => {
      if (err) throw err

      console.log("Done")
   })  */
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
   
module.exports = scrapeData