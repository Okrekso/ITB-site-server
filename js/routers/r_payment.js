let router = require("express").Router();
const secure = require("../database_operations/secureCode");

router.post("/accept", (req, res) => {
  console.log(req.body.data, req.body.signature);
});

module.exports = router;
