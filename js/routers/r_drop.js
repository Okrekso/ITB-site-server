let router = require("express").Router();
let drops = require("../database_operations/drops");
const secure = require("../database_operations/secureCode");

router.get("/availability", (req, res) => {
  drops.checkDropAvailability(result => {
    res.send(result);
  });
});
router.post("/add", (req, res) => {
  let secureCode = req.body.secureCode;
  secure.protectFunction(
    secureCode,
    () => {
      drops.checkDropAvailability(result => {
        if (result == true) {
          drops.addDrop();
          res.send("success");
        } else res.send(strings.s_notTime);
      });
    },
    3,
    access_result => {
      if (!access_result) return res.send(strings.s_accessForbitten);
    }
  );
});

module.exports = router;
