let router = require("express").Router();

router.post("/acceptPayment", (req, res) => {
  console.log(req.body.data, req.body.signature);
});

module.exports = router;
