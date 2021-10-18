/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const TWILIO_DATA = require("../twilio");
const client = new twilio(TWILIO_DATA.ACCOUNT_SID, TWILIO_DATA.AUTH_TOKEN);

var bodyParser = require("body-parser");

const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

module.exports = (db) => {
  router.post("/", async (req, res) => {
    const data = req.body;
    var customer = data.customer;

    // create customer get id
    const { address, fullname, phnumber } = customer;
    let queryParams = [fullname, address, phnumber];
    console.log(queryParams);
    const query_text = `
      INSERT INTO customers(fullname, address, phnumber)
      VALUES($1, $2, $3) RETURNING *
      `;

    const response = await pool.query(query_text, queryParams);
    const customer_id = response.rows[0].id;

    // create orderdetails using customerid
    const orderdetail_query_text = `
    INSERT INTO orderdetails(customer_id, totalAmount, orders)
    VALUES($1, $2, $3) RETURNING *
    `;
    let orderdetailsqueryParams = [
      customer_id,
      parseFloat(data.total),
      JSON.stringify(data.orders),
    ];
    const orderdetailsresponse = await pool.query(
      orderdetail_query_text,
      orderdetailsqueryParams
    );
    // send sms to admin

    client.messages
      .create({
        body: "Hi Mr. Admin. There is a new order",
        from: TWILIO_DATA.TWILIO_NUMBER,
        to: TWILIO_DATA.ADMIN_NUMBER,
      })
      .then((message) => console.log(message.sid));
    res.json({
      message: "Order received",
    });
  });

  router.get("/", async (req, res) => {
    const query_text = `
    SELECT * FROM orderdetails WHERE completed is false
    `;

    const response = await pool.query(query_text);
    res.json({
      incompleteOrders: response.rows,
    });
  });

  router.post("/ready", async (req, res) => {
    //get order detail
    const orderID = parseInt(req.body.orderId);

    const order_query_text = `
    SELECT * FROM orderdetails WHERE id=${orderID}
    `;
    const order_response = await pool.query(order_query_text);
    const orderdetail = order_response.rows[0];
    //get customer details

    const customer_query_text = `
    SELECT * FROM customers WHERE id=${parseInt(orderdetail.customer_id)}
    `;
    const customer_response = await pool.query(customer_query_text);
    const customerdetail = customer_response.rows[0];

    // update order detail
    const update_query_text = `
    UPDATE orderdetails SET completed=true WHERE id=${orderID}
    `;

    const update_response = await pool.query(update_query_text);
    const updatedorderdetails = update_response.rows[0];
    // send sms to customer

    client.messages
      .create({
        body: `Hi ${customerdetail.fullname} :). 
        Your order is ready for pick up. 
          -Coffee Shop`,
        from: TWILIO_DATA.TWILIO_NUMBER,
        to: customerdetail.phnumber,
      })
      .then(
        (message) => console.log(message.sid),
        err => console.log(err));
    res.json({
      updated: true
    });
  });

  return router;
};
