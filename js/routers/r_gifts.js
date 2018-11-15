const gifts = require("../database_operations/gifts");
const secure = require("../database_operations/secureCode");
const users = require("../database_operations/users");
let router = require("express").Router();

router.post("/new", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("new gift from", secureCode);
  secure.protectFunction(
    secureCode,
    () => {
      let bID = req.body.bID;
      let Xp = req.body.Xp;

      gifts.addGift(bID, Xp, () => {
        return res.send("gift sent!");
      });
    },
    2,
    access_result => {
      if (!access_result) {
        return res.send(strings.s_accessForbitten);
      }
    }
  );
});

module.exports = router;
