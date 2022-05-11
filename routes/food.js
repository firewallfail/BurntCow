/*
 * All routes for home are defined here
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`
    SELECT *
    FROM menu_items
    LIMIT 10;
    `)
      .then(data => {
        res.json(data.rows);
      })
      .catch(error => {
        console.log(error);
      });
  });

  router.get("/");

  return router;
};
