const request = require('superagent');
const { parse } = require('node-html-parser');
const { camelCase } = require('lodash')
const fs = require("fs")
const characterData = require("../../data/character")

//let details = new Object()

async function scraper(character) {
   //const character = "Mike_Wheeler"
   //const character = "Dustin_Henderson"
   //const character = "Will_Byers"
   const url = 'https://strangerthings.fandom.com/wiki/' + character

   const response = await request.get(url)
   const data = await response.text
   const parseData = await parse(data)
   
   return parseData
}

async function getName(html) {
   return html.querySelectorAll('.pi-item.pi-item-spacing.pi-title').map(node => node.rawText);
}
   
async function getSummaryLabels(html) {   
   return html.querySelectorAll('h3.pi-data-label').map(node => node.structuredText)   
}

async function getSummaryValues(html) {
   return html.querySelectorAll('div.pi-data-value')
}

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

   //return details

   characterData.push(details)

   fs.writeFile("./data/character.json", JSON.stringify(characterData), err => {
      if (err) throw err

      console.log("Done")
   })
   
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
   
//scrapeData();


async function getCharactersName() {
   const url = 'https://strangerthings.fandom.com/wiki/Stranger_Things_Wiki'

   const response = await request.get(url)
   const data = await response.text
   const parseData = await parse(data)
   const names = await scrapeName(parseData)

   //let aaa = 
   await names.map(name => scrapeData(name))//console.log("is: " + name))


   //console.log(aaa)

   /* fs.writeFile("./src/scraper/test.json", JSON.stringify(details), err => {
      if (err) throw err

      console.log("Done")
   })  */
}

async function scrapeName(html) {
   return html.querySelectorAll('div.portal div.wikia-gallery-row div.wikia-gallery-item div.thumb div.gallery-image-wrapper').map(node => getTitle(node));
}

function getTitle(node) {
   let str = node.innerHTML

   const n = str.indexOf('title')
   str = str.substring(n + 7) //, n + str.indexOf('"'))

   const l = str.indexOf('(')
   str = str.substring(0, l-1).trim()

   //console.log(str + "\n")
   //console.log(n)
   return str
}

getCharactersName()