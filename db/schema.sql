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
