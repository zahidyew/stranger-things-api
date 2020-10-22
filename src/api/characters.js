const { Router } = require('express')
const charactersData = require('../../data/characters')

const router = Router()

router.get('/', (req, res) => {
   res.json(charactersData)
})

router.get('/:name', (req, res) => {
   const data = charactersData.filter( item =>  item.name.toLowerCase().includes(req.params.name.toLowerCase()))      
   res.json (data)
})

module.exports = router

/* {
      "id": 2,
      "name": " ",
      "status": " ",
      "born": " ",
      "age": " ",
      "gender": " ",
      "aliases": " ",
      "family": " ",
      "relationships": " ",
      "playedBy": " "
} */