const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

const properties = require("./json/properties.json");
const users = require("./json/users.json");

const insertCustomerDetails = function (customer) {
  const { address, fullname, phNumber } = customer;
  let queryParams = [fullname, address, phNumber];
  console.log(queryParams);
  const query_text = `
  INSERT INTO customers(fullname, address, phNumber)
  VALUES ($1, $2, $3)
  `;

  return pool
    .query(query_text, queryParams)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};
exports.insertCustomerDetails = insertCustomerDetails;

// const getAllProperties = function(options, limit = 10) {
//   const { city,
//     owner_id,
//     minimum_price_per_night,
//     maximum_price_per_night,
//     minimum_rating
//   } = options;
//   let queryParams = [];
//   let queryString = `
//   SELECT
//   properties.*,
//   avg(property_reviews.rating) as average_rating
// FROM
//   properties
//   JOIN property_reviews ON property_id = properties.id
//   WHERE 1 = 1
//   `
//   if (city) {
//     queryParams.push(`%${city}%`);
//     queryString += `AND city LIKE $${queryParams.length} `;
//   };

//   if (owner_id) {
//     queryParams.push(owner_id);
//     queryString += `AND properties.owner_id = $${queryParams.length} `;
//   };

//   if (minimum_price_per_night) {
//     queryParams.push(minimum_price_per_night * 100);
//     queryString += `AND cost_per_night >= $${queryParams.length} `;
//   };

//   if (maximum_price_per_night) {
//     queryParams.push(maximum_price_per_night * 100);
//     queryString += `AND cost_per_night <= $${queryParams.length} `;
//   };

//   queryString += 'GROUP BY properties.id '

//   if (minimum_rating) {
//     queryParams.push(minimum_rating);
//     queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;

//   }
//     queryParams.push(limit);
//     queryString +=`LIMIT $${queryParams.length}`

//     console.log(queryString, queryParams);// test

// return pool.query(queryString, queryParams)
// .then(res => {
// console.log(res.rows)
// console.log("search sucessful! Congratulations!!!")
// return res.rows;
// })
// .catch(err => console.log(err))

// }
// exports.getAllProperties = getAllProperties;

// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function(property) {
//   const property_keys = Object.keys(property) // getting table's column as an array
//   const numOfColumn = property_keys.length; // getting the num of column
//   const row_value = [];
//   for (let i = 1; i <= numOfColumn;  i++) { //pushing $n value for deparamatization
//     let eachCellValue = `$${i}`;
//     row_value.push(eachCellValue);
//   }
//   const property_values = Object.values(property)
//   const queryString = `
//   INSERT INTO properties (${property_keys.join(', ')})
//   VALUES(${row_value.join(', ')})
//   RETURNING *
//   `
// return pool.query(queryString, property_values)
// .then(res => {
//   console.log("Property added successfully")// test
//   return res.rows;
// })
// .catch(err => console.log(err))
// }
// exports.addProperty = addProperty;
