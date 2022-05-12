/*
 * All routes for home are defined here
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioReceivingNumber = process.env.RECEIVING_NUMBER;
const client = require('twilio')(accountSid, authToken);

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

    client.messages
      .create({
        body: `Order: ${order} will be ready at ${pickupTime}`,
        from: twilioNumber,
        to: twilioReceivingNumber
      })
      .then(message => console.log(message.sid));

    const values = [pickupTime, order]

    db.query(`
    UPDATE orders
    SET time_complete = $1
    WHERE id = $2;
    `, values)
      .then(() => {
        const twiml = new MessagingResponse();

        twiml.message(`Server Updated`);

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        return res.end(twiml.toString());
      })
      .catch(err => {
        console.log(err);
        const twiml = new MessagingResponse();

        twiml.message(`Server Error`);

        res.writeHead(500, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      })


  });

  return router;
};
