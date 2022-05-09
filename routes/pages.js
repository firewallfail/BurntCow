/*
 * All routes for the web pages are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get("/", (req, res) => {
    res.render('index');
  });

  router.get("/login", (req, res) => {
    res.render('login');
  });

  router.get("/order", (req, res) => {
    res.render('order');
  });

  router.get("/register", (req, res) => {
    res.render('register');
  });

  router.get("/user", (req, res) => {
    res.render('user');
  });

  return router;
};
