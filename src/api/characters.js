const { Router } = require('express')
const charactersData = require('../../data/characters')

const router = Router()

router.get('/', (req, res) => {
   res.json(charactersData)
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