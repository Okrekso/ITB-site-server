const gifts = require("../database_operations/gifts");
const secure = require("../database_operations/secureCode");
const users = require("../database_operations/users");
let router = require("express").Router();
const strings = require("../strings");

router.post("/new", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("new gift from", secureCode);
  secure.protectFunctionType(
    secureCode,
    () => {
      let bID = req.body.bID;
      let Xp = req.body.Xp;

      gifts.addGift(bID, Xp, secureCode, () => {
        return res.send("gift sent!");
      });
    },
    "Speaker, Admin",
    access_result => {
      if (!access_result) {
        return res.send(strings.s_accessForbitten);
      }
    }
  );
});

module.exports = router;
