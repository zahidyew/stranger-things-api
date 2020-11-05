const { Router } = require('express')
const charactersData = require('../../data/character')

const router = Router()

router.get('/', (req, res) => {   
   // if request made includes query
   if (Object.keys(req.query).length > 0) {
      let newArray
      let msgWhenEmpty = "Character doesn't exist"
      
      if (req.query.age !== undefined) {
         newArray = charactersData.filter( item => item.age.includes(req.query.age))
      }
      if (req.query.status !== undefined) {
         newArray = charactersData.filter( item => item.status.toLowerCase().includes(req.query.status.toLowerCase()))
      }
      if (req.query.born !== undefined) {
         newArray = charactersData.filter(item => item.born.includes(req.query.born))
      }
      /* if (req.query.aliases !== undefined) {
         newArray = charactersData.filter(item => item.aliases.forEach(alias => alias.includes(req.query.aliases)))
      } */
      if (req.query.limit !== undefined) {
         req.query.age !== undefined || req.query.status !== undefined || req.query.born !== undefined
            ? newArray = newArray.slice(0, req.query.limit)       // request has multiple queries plus limit
            : newArray = charactersData.slice(0, req.query.limit) // request only includes limit

         msgWhenEmpty = "Limit must be more than 0"
      }
      return newArray == '' ? res.json(msgWhenEmpty) : res.json(newArray)
   } else {
      res.json(charactersData)
   } 
})

router.get('/:name', (req, res) => {
   const data = charactersData.filter( item =>  item.name.toLowerCase().includes(req.params.name.toLowerCase()))  
   
   data == '' ? res.json("Character doesn't exist") : res.json(data)
})

module.exports = router