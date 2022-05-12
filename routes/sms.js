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

    const incomingMessage = req.body.Body;
    if (incomingMessage[0] !== "!") {
      const twiml = new MessagingResponse();

      twiml.message(`Please do not respond to this number.`);

      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
      return router;
    }

    const order = incomingMessage.split(":")[0].slice(1);
    const currentDate = new Date();
    const timeAsMlSeconds = currentDate.getTime();
    const time = incomingMessage.split(":")[1] * 60 * 1000;
    const pickupTime = new Date(timeAsMlSeconds + time);


    const twiml = new MessagingResponse();

    twiml.message(`Order: ${order} will be ready at ${pickupTime}`);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

  });

  return router;
};
