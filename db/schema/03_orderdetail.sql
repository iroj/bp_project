-- Drop and recreate menuitems table (Example)


CREATE TYPE orderitems (
  id INT,
  quantity INT,
  item_name VARCHAR,
  amount FLOAT
);

DROP TABLE IF EXISTS orderdetails CASCADE;

CREATE TABLE orderdetails (
  id SERIAL PRIMARY KEY NOT NULL,
  totalAmount INT NOT NULL,
  customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
  orders orderitems[],
  completed BOOL
);
