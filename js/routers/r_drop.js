let router = require("express").Router();
let drops = require("../database_operations/drops");
const secure = require("../database_operations/secureCode");
const strings = require("../strings");

router.get("/availability", (req, res) => {
  let secureCode = req.query.secureCode;
  secure.protectFunctionType(
    secureCode,
    () => {
      drops.checkDropAvailability(result => {
        res.send(result);
      });
    },
    "Admin",
    access_result => {
      if (!access_result) return res.send(strings.s_accessForbitten);
    }
  );
});
router.post("/add", (req, res) => {
  let secureCode = req.body.secureCode;
  secure.protectFunctionType(
    secureCode,
    () => {
      drops.checkDropAvailability(result => {
        if (result == true) {
          drops.addDrop();
          res.send("success");
        } else res.send(strings.s_notTime);
      });
    },
    "Admin",
    access_result => {
      if (!access_result) return res.send(strings.s_accessForbitten);
    }
  );
});

module.exports = router;
