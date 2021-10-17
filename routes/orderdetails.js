/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    var orderdetails = req.body;
    // create customer get id
    // set status as inprogress
    // create orderdetails using customerid
    //


    console.log(req.body);

    res.json({});
  });

  return router;
};
