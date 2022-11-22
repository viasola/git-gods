const express = require('express')
const app = express()
const { Pool } = require('pg')
const port = 8080

db = new Pool({
  user: 'postgres',
  database: 'findr', 
  password: 'edthoo' //process.env.DATABASE_PASSWORD
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/api/owners/total', (req, res) => {
  const sql = `SELECT owner, count(*) FROM petrol_stations GROUP BY owner ORDER BY count DESC;`
  db.query(sql).then(dbRes => res.json(dbRes.rows))
})

app.get('/api/stations/all', (req, res) => {
  let sql = 'SELECT * FROM petrol_stations ORDER BY petrol_stations ASC LIMIT 300;'
  db.query(sql).then(dbRes => res.json(dbRes.rows))
})

app.get('/api/stations/random', (req, res) => {
  let sql = `SELECT * FROM petrol_stations;`
  db.query(sql).then(dbRes => {
    const data = dbRes.rows
    const dataLength = Object.keys(data).length
    const randomIdx = Math.floor(Math.random() * dataLength)
    res.json(dbRes.rows[randomIdx])
  })
})

app.get('/api/stats', (req, res) => {

  const sql = `SELECT owner, count(*) as total FROM petrol_stations GROUP BY owner;`

  db.query(sql).then(dbRes =>

    res.json({ totalByOwner: dbRes.rows.filter(row => row.total > 1), "total": `${dbRes.rows.filter(row => row).map(row => Number(row.total)).reduce((a, b) => a + b)}` })
  )
})

app.get('/api/stations/nearest', (req, res) => {
  let currentLat = req.query.lat
  let currentLong = req.query.long
  let rad = req.query.rad

  let sql = `
    SELECT * FROM (
    SELECT  *,( 
      3959 * acos( cos( radians(${currentLat}) ) * cos( radians( lat ) ) * cos( radians( long ) - radians(${currentLong}) ) + sin( radians(${currentLat}) ) * sin( radians( lat ) ) ) ) 
      AS distance 
      FROM petrol_stations
    ) AS nearest_stations
    WHERE distance < ${rad}
    ORDER BY distance
    LIMIT 700;
    `
    // res.send(sql)

  db.query(sql).then(dbRes => res.json(dbRes.rows))
})


app.listen(port)