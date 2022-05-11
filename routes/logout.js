/*
 * All routes for home are defined here
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.clearCookie('user_id');
    res.clearCookie('user_id.sig'); //TODO: Use recommended method of clearing session -> req.session = null
    return res.redirect("/order");
  });

  router.post("/", (req, res) => {
    res.clearCookie('user_id');
    res.clearCookie('user_id.sig');
    return res.redirect("/order");
  });
  return router;
};
