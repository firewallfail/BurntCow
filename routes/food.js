/*
 * All routes for home are defined here
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const search = req.query.search;

    let queryString = `
    SELECT *
    FROM menu_items
    `;
    const queryParams = [limit, offset];

    if (search) {
      queryParams.push(`%${search}%`);
      queryString += `WHERE item ILIKE $${queryParams.length} OR description ILIKE $${queryParams.length}`;
    }

    queryString += `
    LIMIT $1
    OFFSET $2;
    `;

    console.log(queryString, queryParams);
    db.query(queryString, queryParams)
      .then(data => {
        res.json(data.rows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json("An error occured");
      });
  });

  router.get("/:id", (req, res) => {
    db.query(`
    SELECT *
    FROM menu_items
    WHERE id = $1;
    `, [req.params.id])
      .then(data => {
        res.json(data.rows[0] || {});
      })
      .catch(error => {
        console.log(error);
        res.status(500).json("An error occured");
      });
  });

  return router;
};
