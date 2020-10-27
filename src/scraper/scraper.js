const request = require('superagent');
const { parse } = require('node-html-parser');
const { camelCase } = require('lodash')

async function scraper() {
   //const character = "Mike_Wheeler"
   const character = "Dustin_Henderson"
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

async function scrapeData() {
   const parseData = await scraper()

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
            const reformatted = structure.split('<br>').map(str => reformat(str).trim())
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
            details[label] = value
         } 
         else if (label == 'gender') {
            details[label] = value
         } 
         else if (label == 'portrayedBy') {
            details[label] = value
         } 
         else {
            //console.log(label + " null")
         }
      }  
   }

   if(!details.hasOwnProperty('relationshipStatus')) {
      details['relationshipStatus'] = 'undefined'
   } //aliases, family, 
   console.log(details)
}

function reformat(str) {
   str = str.replace(/[""|”]/g, "")
   str = str.replace('<p>', "")
   str = str.replace('</p>', "")
   str = str.replace('</a>', "")
   str = str.replace('<small>', "")
   str = str.replace('</small>', "")

   return str
}

function removeHref(str) {
   str = reformat(str)
   
   const start = str.indexOf('<a')
   const end = str.indexOf('>')
   const s = str.substring(start, end+1)

   str = str.replace(s, "")

   return str
}
   
scrapeData();