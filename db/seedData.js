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
  database: 'test1',
  password: process.env.DATABASE_PASSWORD
})
}
const fs = require('fs')

const file = fs.readFileSync('./petrolstation.csv', {encoding: 'utf8'})


file.split('\n').forEach((line,idx) => {
  let streetAdd = line.split(',')[9].replace(/\W/g, ' ')
  let city = line.split(',')[10]
  let name = line.split(',')[5]
  let owner = line.split(',')[7]
  let lat = line.split(',')[14]
  let long = line.split(',')[15]
  
  let sql = `INSERT INTO testdata (name, owner, street_add, city, lat, long)
  VALUES ('${name}', '${owner}', '${streetAdd}', '${city}', ${lat}, ${long})`
  db.query(sql, (err, res) =>{
    console.log(err)
  })
})




