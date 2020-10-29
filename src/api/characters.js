const { Router } = require('express')
const charactersData = require('../../data/character')

const router = Router()

router.get('/', (req, res) => {   
   if (req.query.limit !== undefined ) {
      const newArray = charactersData.slice(0, req.query.limit)
      return res.json(newArray)
   }

   res.json(charactersData)
})

router.get('/:name', (req, res) => {
   const data = charactersData.filter( item =>  item.name.toLowerCase().includes(req.params.name.toLowerCase()))  
   
   if (data == '') {
      res.json("Character doesn't exist")
   } else {
      res.json(data)
   }
})

module.exports = router