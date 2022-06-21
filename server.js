const express = require('express')
const app = express()
const { Pool } = require('pg')
const port = 8080

app.use(express.static('public'))

app.get('/', (req, res) =>{
  res.render('index')
})

app.listen(port)