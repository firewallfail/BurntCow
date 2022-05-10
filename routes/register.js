/*
 * All routes for register are defined here
 *   these routes are mounted onto /register
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { BCRYPT_SALT } = process.env;

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });

  router.post("/", (req, res) => {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.json(400, "Missing information");
    }

    const values = [
      fullName,
      email,
      phone,
      bcrypt.hashSync(password, BCRYPT_SALT)
    ];
    db.query(`
    SELECT * FROM users
    WHERE email = $1;
    `, [email])
      .then(data => {
        if (data.rows.length) {
          throw { code: 409, errorText: "Email already in use, please use a different one" };
        }

        return db.query(`
        SELECT * FROM users
        WHERE phone = $1;
        `, [phone]);
      })
      .then(data => {
        if (data.rows.length) {
          throw { code: 409, errorText: "Phone number already in use, please use a different one" };
        }

        return db.query(`
        INSERT INTO users(name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, values);
      })
      .then(user => {
        req.session.userId = user.rows[0].id;
        return res.status(201).json("User created");
      })
      .catch(error => {
        console.error(error);
        if (error.code) {
          return res.status(error.code).json(error.errorText);
        }
        res.status(500).json("An error has occured, please try again later");
      });
  });
  return router;
};
