const request = require('superagent');
const { parse } = require('node-html-parser');

async function scraper() {
   const character = "Dustin_Henderson"
   const url = 'https://strangerthings.fandom.com/wiki/' + character

   const response = await request.get(url)
   const data = await response.text
   const parseData = await parse(data)
   
   return parseData
}

async function getName(html) {
   return html.querySelectorAll('.pi-item.pi-item-spacing.pi-title').map(node => node.rawText);
}
   
async function getCharacterSummary(html) {
   return html.querySelectorAll('.pi-data-value.pi-font').map(node => node.rawText)
}

async function getPicture(html) {
   return html.querySelectorAll('.pi-image-thumbnail')[0].getAttribute('src')
}

async function scrapeData() {
   const parseData = await scraper()

   const summary = await getCharacterSummary(parseData)

   const name = await getName(parseData)
   const picture = await getPicture(parseData)

   const status = summary[0]
   const born = summary[1]
   const age = summary[2].substring(0,2)
   const aliases = summary[3]
   const relationshipStatus = summary[5]
   const family = summary[6]
   const otherRelations = summary[7]
   const occupation = summary[9]
   const gender = summary[10]
   const playedBy = summary[13]

   console.log("Name: " + name.toString())
   console.log("Status: " + status)
   console.log("Born: " + born)
   console.log("Age: " + age)
   console.log("Aliases: " + aliases)
   console.log("Picture link: " + picture)
   console.log("Relationship status: " + relationshipStatus)
   console.log("Family: " + family)
   console.log("Other Relations: " + otherRelations)
   console.log("Occupation: " + occupation)
   console.log("Gender: " + gender)
   console.log("Played by: " + playedBy)
}
   
scrapeData();