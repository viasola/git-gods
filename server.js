const express = require('express')
const app = express()
const { Pool } = require('pg')
const port = 8080

db = new Pool({
  user: 'postgres',
  database: 'test1',
  password: ''
})

app.use(express.static('public'))

app.get('/', (req, res) =>{
  res.render('index')
})

app.get('/api/owners/total', (req, res) => {
  const sql = `SELECT owner, count(*) FROM testdata GROUP BY owner;`
  db.query(sql).then(result => res.send(result.rows))
})

app.listen(port)