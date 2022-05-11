/*
 * All routes for home are defined here
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      userId: req.session.userId
    };
    res.render("index", templateVars);
  });

  router.post("/", (req, res) => {
    db.query(`
    SELECT *
    FROM menu_items
    WHERE id > 50
    LIMIT 10;
    `)
      .then(data => {
        res.json(data.rows);
      })
      .catch(error => {
        console.log(error);
      });
  });
  return router;
};
