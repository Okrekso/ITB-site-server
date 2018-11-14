const express = require("express");
const db = require("./database");
const users = require("./database_operations/users");
const visits = require("./database_operations/visits");
const drops = require("./database_operations/drops");
const secure = require("./database_operations/secureCode");
const request = require("./database_operations/requests");
const mail = require("./mail");
const strings = require("./strings");

// requiers

// strings
var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", strings.s_site);
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// default
app.use("/", require("./routers/r_default"));
// drops
app.use("/", require("./routers/r_drop"));
// users
app.use("/", require("./routers/r_users"));
// events
app.use("/", require("./routers/r_events"));
// visits
app.use("/", require("./routers/r_visits"));
// requests
app.use("/", require("./routers/r_requests"));
// payment
app.use("/", require("./routers/r_payment"));

app.listen(3000);
