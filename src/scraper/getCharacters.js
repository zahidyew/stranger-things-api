const request = require('superagent');
const { parse } = require('node-html-parser');
const scrapeData = require('./scraper')

async function getCharacters() {
   const url = 'https://strangerthings.fandom.com/wiki/Stranger_Things_Wiki'

   const response = await request.get(url)
   const data = await response.text
   const parseData = await parse(data)
   const names = await scrapeName(parseData)

   //console.log(names)

   await names.map(name => scrapeData(name))
}

async function scrapeName(html) {
   //return html.querySelectorAll('div.portal div.wikia-gallery-row div.wikia-gallery-item div.thumb div.gallery-image-wrapper').map(node => getTitle(node));

   return html.querySelectorAll('div.portal div.wikia-gallery-row div.wikia-gallery-item div.thumb div.gallery-image-wrapper .image.link-internal').map(node => getTitle(node));

   //return html.querySelectorAll('div.lightbox-caption').map(node => node.rawText.toLowerCase()) //owens wont reroute to its page :(
}

function getTitle(node) {
   let str = node.getAttribute('title')

   str = str.substring(0, str.indexOf('(')).trim()
   //console.log(str)

   /* const n = str.indexOf('title')
   str = str.substring(n + 7) //, n + str.indexOf('"'))

   const l = str.indexOf('(')
   str = str.substring(0, l-1).trim() */

   //console.log(str + "\n")
   //console.log(n)
   return str
}

getCharacters()