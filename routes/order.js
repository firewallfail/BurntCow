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
    // const userId = req.session.userId;

    const timeOrdered = new Date(Date.now());

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

        queryParams += ` RETURNING order_id;`

        return db.query(queryParams, values);

      })
      .then((result) => {

        const values = [result.rows[0].order_id];
        client.messages
          .create({
            body: `${values[0]}`,
            from: twilioNumber,
            to: twilioReceivingNumber
          })
          .then(message => console.log(message.sid));

        return db.query(`UPDATE orders
        SET total_price = (select sum(price) from ordered_items join menu_items on item_id = menu_items.id where order_id = $1)
        WHERE id = $1;
        `, values)
      })
      .then((result) => {
        return res.status(200).json('cooooooool');
      })
      .catch((err) => {
        console.log(err.message)
      })
  });
  return router;
};
