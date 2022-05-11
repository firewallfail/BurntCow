/*
 * All routes for userSettings are defined here
 *   these routes are mounted onto /userSettings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { BCRYPT_SALT } = process.env;

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
    const { fullName, email, password } = req.body;
    const phone = req.body.phone.split(/[^0-9]/gm).join('');
    const userId = req.session.userId;

    const values = [
      fullName,
      email,
      phone,
      userId
    ];

    db.query(`UPDATE users
    SET name = $1,
        email = $2,
        phone = $3
    WHERE id = $4`, values)
      .then(data => {
        if (!password) {
          return res.status(200).json("Profile updated");
        }
        const values = [
          bcrypt.hashSync(password, BCRYPT_SALT),
          userId
        ];
        return db.query(`UPDATE users
        SET password = $1
        WHERE id = $2`, values);
      })
      .then(data => {
        return res.status(200).json("Profile updated");
      })
      .catch(err => {
        res.status(500).json("An error has occured, please try again later");
      });
  });
  return router;
};
