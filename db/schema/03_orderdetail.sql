-- Drop and recreate menuitems table (Example)

DROP TYPE IF EXISTS ordermenuitems CASCADE;
CREATE TYPE ordermenuitems as (
  id INT,
  quantity INT,
  name VARCHAR(100),
  rate FLOAT,
  amount FLOAT
);

DROP TABLE IF EXISTS orderdetails CASCADE;

CREATE TABLE orderdetails (
  id SERIAL PRIMARY KEY NOT NULL,
  totalAmount FLOAT NOT NULL,
  customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
  orders TEXT,
  completed BOOL DEFAULT false
);
