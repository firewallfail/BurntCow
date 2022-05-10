/*
 * All routes for login are defined here
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      return res.redirect('/order');
    }
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
        const user = data.rows[0];
        if (!user || password !== user.password) {
          return res.redirect('/login');
        }
        req.session.user_id = user.id;
        return res.redirect('/order');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
