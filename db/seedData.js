const { Pool } = require('pg')
let db

if (process.env.NODE_ENV === 'production'){

  db = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  db = new Pool({
  user: 'postgres',
  database: 'findr',
  password: 'edthoo'
})
}
const fs = require('fs')

const file = fs.readFileSync('./petrolstations.csv', {encoding: 'utf8'})

file.split('\n').forEach((line,idx) => {
  let streetAdd = line.split(',')[9]
  let city = line.split(',')[10]
  let name = line.split(',')[5]
  let owner = line.split(',')[7]
  let lat = line.split(',')[14]
  let long = line.split(',')[15]

  
  let sql = 'INSERT INTO petrol_stations (name, owner, street_add, city, lat, long) VALUES ($1, $2, $3, $4, $5, $6)'
  db.query(sql, [name, owner, streetAdd, city, lat, long], (err, res) =>{
    console.log(err)
  })
})




