// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const bodyParser = require("body-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'user_id',
  secret: COOKIE_SECRET
}));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const homeRoutes = require("./routes/home");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const profileRoutes = require("./routes/profile");
const orderRoutes = require("./routes/order");
const logoutRoutes = require("./routes/logout");
const foodRoutes = require("./routes/food");
const smsRoutes = require("./routes/sms");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/", homeRoutes(db));
app.use("/login", loginRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/profile", profileRoutes(db));
app.use("/order", orderRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/food", foodRoutes(db));
app.use("/sms", smsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
