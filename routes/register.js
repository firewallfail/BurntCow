/*
 * All routes for register are defined here
 *   these routes are mounted onto /register
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });

  router.post("/", (req, res) => {
    console.log(req.body);
    res.redirect("/register");
  });
  return router;
};
