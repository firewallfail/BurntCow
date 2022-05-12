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

    const userId = 1;
    const timeOrdered = new Date(Date.now());

    // const userId = req.session.userId;
    const values = [userId, timeOrdered];

    db.query(`
    INSERT INTO orders (user_id, time_ordered)
    VALUES
    ($1, $2)
    RETURNING id;
    `, values)
      .then((result) => {
        const orderId = result.rows[0].id;

        const values = [];

        for (const key in incomingOrder) {
          values.push(orderId);
          values.push(Number(key));
          values.push(incomingOrder[key]);
        }

        let queryParams = `INSERT INTO ordered_items (order_id, item_id, quantity) VALUES `;

        for (let i = 1; i < values.length; i += 3) {
          queryParams += (`($${i}, $${i + 1}, $${i + 2})`);
          if (i + 2 < values.length) {
            queryParams += `, `
          }
        }



        console.log(queryParams);

        return res.status(200).json(queryParams);
      })
      .catch((err) => {
        console.log(err.message)
      })

    // client.messages
    //   .create({
    //     body: `POSTING`,
    //     from: twilioNumber,
    //     to: twilioReceivingNumber //TODO: Make this the result of a database query for the user's phone number
    //   })
    //   .then(message => console.log(message.sid));

    // db.query(`SELECT * FROM users;`)
    //   .then(data => {
    //     const users = data.rows;
    //     res.json({ users });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  });
  return router;
};
