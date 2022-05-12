/*
 * All routes for home are defined here
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = (db) => {
  router.post("/", (req, res) => {

    console.log(req.body.Body);
    const order = req.body.Body.split(":")[0];
    const currentDate = new Date();
    const timeAsMlSeconds = currentDate.getTime();
    const time = req.body.Body.split(":")[1] * 60 * 1000;
    const pickupTime = new Date(timeAsMlSeconds + time);


    const twiml = new MessagingResponse();

    twiml.message(`Order: ${order} will be ready at ${pickupTime}`);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

  });

  return router;
};
