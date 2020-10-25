const request = require('superagent');
const { parse } = require('node-html-parser');

const scraper = async () => {
   /* return request
      .get('https://strangerthings.fandom.com/wiki/Dustin_Henderson')
      .then(res => res.text)
      .then(parse)
      .then(titlesList)
      .then(console.log); */

   const response = await request.get('https://strangerthings.fandom.com/wiki/Dustin_Henderson')
   const data = await response.text
   const parseData = await parse(data)
   const scrapedData = await born(parseData)
   console.log(scrapedData)
}

const titlesList = html => html
   .querySelectorAll('.pi-item.pi-item-spacing.pi-title')
   .map(node => node.rawText);

const born = html => html.querySelectorAll('.pi-data-value.pi-font').map(node => node.rawText)

scraper();