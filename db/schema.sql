CREATE DATABASE test1;

CREATE TABLE testdata (
  id SERIAL PRIMARY KEY,
  name TEXT,
  owner TEXT,
  lat REAL,
  long REAL
);

COPY testdata(name, owner, lat, long)
FROM '\\wsl$\Ubuntu\home\gankokken\sei\project\git-gods\db\petrolstation.csv'
DELIMITER ','
CSV HEADER;