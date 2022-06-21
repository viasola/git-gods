CREATE DATABASE test1;

CREATE TABLE testdata (
  id SERIAL PRIMARY KEY,
  name TEXT,
  owner TEXT,
  street_add TEXT,
  city TEXT,
  lat REAL,
  long REAL
);
