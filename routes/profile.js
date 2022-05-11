/*
 * All routes for userSettings are defined here
 *   these routes are mounted onto /userSettings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }
    const values = req.session.userId;
    db.query(`
    SELECT  * FROM users
    WHERE id = $1;
    `, [values])
      .then(data => {
        const user = data.rows[0];
        const templateVars = {
          userId: req.session.userId,
          name: user.name,
          email: user.email,
          phone: user.phone
        };
        res.render("profile", templateVars);
      })
  });

  router.post("/", (req, res) => {
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
