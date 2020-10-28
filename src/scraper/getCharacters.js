const request = require('superagent');
const { parse } = require('node-html-parser');
const getDetails = require('./getCharDetails')

// scrape the page for characters name
async function scrapePage() {
   const url = 'https://strangerthings.fandom.com/wiki/Stranger_Things_Wiki'

   const response = await request.get(url)
   const data = await response.text
   const parsedData = await parse(data)
   const characters = await scrapeName(parsedData)

   //console.log(characters)

   // get each character details
   await characters.map(character => getDetails(character))
}

// get the elements that contain the characters name
async function scrapeName(html) {
   return html
      .querySelectorAll('div.portal div.wikia-gallery-row div.wikia-gallery-item div.thumb div.gallery-image-wrapper .image.link-internal')
      .map(node => getCharacterName(node));
}

// clean the data to get character name from the title of each element
function getCharacterName(node) {
   let str = node.getAttribute('title')
   str = str.substring(0, str.indexOf('(')).trim()

   return str
}

scrapePage()