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
  password: 'aiching'
})
}
const fs = require('fs')

const file = fs.readFileSync('./petrolstations.csv', {encoding: 'utf8'})


file.split('\n').forEach((line,idx) => {
  let streetAdd = line.split(',')[9].replace(/\W/g, ' ')
  let city = line.split(',')[10].replace(/\W/g, ' ')
  let name = line.split(',')[5].replace(/\W/g, ' ')
  let owner = line.split(',')[7].replace(/\W/g, ' ')
  let lat = line.split(',')[14]
  let long = line.split(',')[15]
  
  let sql = `INSERT INTO petrol_stations (name, owner, street_add, city, lat, long)
  VALUES ('${name}', '${owner}', '${streetAdd}', '${city}', ${lat}, ${long})`
  db.query(sql, (err, res) =>{
    // console.log(err)
  })
})




