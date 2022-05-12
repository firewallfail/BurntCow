/*
 * All routes for login are defined here
 *   these routes are mounted onto /order
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioReceivingNumber = process.env.RECEIVING_NUMBER;
const client = require('twilio')(accountSid, authToken);

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      userId: req.session.userId
    };
    res.render("order", templateVars);
  });

  router.post("/", (req, res) => {

    const incomingOrder = { "51": 1, "52": 1, "53": 1, "54": 1, "55": 2 };

    console.log(incomingOrder);

    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
