CREATE DATABASE findr;

CREATE TABLE petrol_stations (
  id SERIAL PRIMARY KEY,
  name TEXT,
  owner TEXT,
  street_add TEXT,
  city TEXT,
  lat REAL,
  long REAL
);

SELECT sum(pg_column_size(t.*)) as filesize, count(*) as filerow FROM testdata as t;

SELECT count(*) as filerow FROM testdata as t;

SELECT owner, count(*) FROM petrol_stations GROUP BY owner;



SELECT count(*) AS 'how many', 'owners' FROM petrol_stations where 'how many' > 1 GROUP BY 'owners';