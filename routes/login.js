/*
 * All routes for login are defined here
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { BCRYPT_SALT } = process.env;

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.session.userId) {
      return res.redirect('/');
    }
    res.render("login");
  });

  router.post("/", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('hitting');
      return res.json(400, "Missing information");
    }

    //TODO: Verify password field during login
    db.query(`
    SELECT *
    FROM users
    WHERE LOWER(email) LIKE $1
    ;`,
      [email.toLowerCase()])
      .then(data => {
        const user = data.rows[0];
        if (!user) {
          throw { code: 409, errorText: "Wrong Email" }; //TODO: Remove details of incorrect login in response
        }
        //log in dummy accounts with any password
        if (user.id < 1000) { //TODO: Remove auto-login when using dummy accounts
          req.session.userId = user.id;
          return res.status(200).json('Logged In');
        }
        const hashedPassword = user.password;
        if (!bcrypt.compareSync(password, hashedPassword)) {
          throw { code: 409, errorText: "Wrong Password" }; //TODO: Use HTTP code 401 ("Unauthorized"), instead of 409 ("Conflict")
        }
        req.session.userId = user.id;
        return res.status(200).json('Logged In');
      })
      .catch(err => {
        console.log(err);
        if (err.code) {
          return res.status(err.code).json(err.errorText);
        }
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
