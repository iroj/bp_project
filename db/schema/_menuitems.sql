-- Drop and recreate menuitems table (Example)

DROP TABLE IF EXISTS menuitems CASCADE;
CREATE TABLE menuitems (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price FLOAT NOT NULL,
  imgLink TEXT NOT NULL
);
