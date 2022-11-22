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

SELECT sum(pg_column_size(t.*)) as filesize, count(*) as filerow FROM petrol_stations as t;


SELECT owner, count(*) FROM petrol_stations GROUP BY owner;


SELECT owner, (select count(*) FROM petrol_stations HAVING count(*) > 1) as total, (select count(*) FROM petrol_stations) as totalStations from (select Distinct owner from petrol_stations);

SELECT owner from petrol_stations; (select count(*) as total FROM petrol_stations GROUP BY owner HAVING COUNT(*) > 1), (select count(*) FROM petrol_stations) as totalStations; 

select owner, count(*) as total, sum(count(*)) over() as totalStations from petrol_stations group by owner having count(owner) > 1;

SELECT owner, count(*) AS total FROM petrol_stations GROUP BY owner HAVING count(owner) > 1 
INNER JOIN 
SELECT sum(count(*)) over() as totalStations from petrol_stations ON total;

select owner, count(*) as total, sum(count(*)) over() as totalStations from petrol_stations group by owner having count(owner) > 1;

select * from (
SELECT  *,( 3959 * acos( cos( radians(-37.8183 /*currentLat*/) ) * cos( radians( lat ) ) * cos( radians( long ) - radians(144.9671 /*currentLong*/) ) + sin( radians(-37.8183 /*currentLat*/) ) * sin( radians( lat ) ) ) ) AS distance 
FROM petrol_stations
) AS nearest_stations
where distance < 5
ORDER BY distance
LIMIT 700;
