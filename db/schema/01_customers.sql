DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
  id SERIAL PRIMARY KEY NOT NULL,
  fullname VARCHAR(255),
  address TEXT,
  phnumber VARCHAR(25)
);
