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

    let incomingMessage = req.body.Body;
    if (!incomingMessage.startsWith("!")) {
      const twiml = new MessagingResponse();

      twiml.message(`Please do not respond to this number.`);

      return res.send(twiml.toString());
    }

    incomingMessage = incomingMessage.substring(1); //Remove "!"
    let [orderId, orderDelay] = incomingMessage.split(":");
    orderDelay *= 60 * 1000; //Convert minutes to milliseconds
    const pickupTime = new Date(Date.now() + orderDelay);

    client.messages
      .create({
        body: `Order: ${orderId} will be ready at ${pickupTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`,
        from: twilioNumber,
        to: twilioReceivingNumber //TODO: Make this the result of a database query for the user's phone number
      })
      .then(message => console.log(message.sid));

    const values = [pickupTime, orderId];

    db.query(`
    UPDATE orders
    SET time_complete = $1
    WHERE id = $2;
    `, values)
      .then(() => {
        const twiml = new MessagingResponse();

        twiml.message(`Server Updated`);
        console.log(twiml);
        return res.send(twiml.toString());
      })
      .catch(err => {
        console.log(err);
        const twiml = new MessagingResponse();

        twiml.message(`Formatting error, please be sure to use !orderId:timeInMinutes`);

        return res.status(500).send(twiml.toString());
      });


  });

  return router;
};
