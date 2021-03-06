const express = require("express");
const strings = require("./strings");
module.exports.isTest = false
// requiers

// strings
var app = express();
app.use((req, res, next) => {
  let origin = req.headers.origin;
  if(strings.s_site.indexOf(origin)>-1)
    res.setHeader("Access-Control-Allow-Origin", origin);

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
app.use("/drops", require("./routers/r_drop"));
// users
app.use("/users", require("./routers/r_users"));
// events
app.use("/events", require("./routers/r_events"));
// visits
app.use("/visits", require("./routers/r_visits"));
// requests
app.use("/requests", require("./routers/r_requests"));
// gifts
app.use("/gifts",require("./routers/r_gifts"));
// payment
app.use("/payment", require("./routers/r_payment"));
// grants
app.use("/grants", require("./routers/r_grants"));
// santas
app.use("/santa", require("./routers/r_santa"));

let timeout = require("connect-timeout");
app.use(timeout('7s'));

app.listen(require("./constants").port);