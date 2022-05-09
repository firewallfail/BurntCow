/*
 * All routes for login are defined here
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", (req, res) => {
    const { email, password } = req.body;
    db.query(`
    SELECT *
    FROM users
    WHERE email LIKE $1
    ;`,
      [email.toLowerCase()])
      .then(data => {
        if (password === data.rows[0].password) {
          return res.redirect('/order');
        }
        res.redirect('/login');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
