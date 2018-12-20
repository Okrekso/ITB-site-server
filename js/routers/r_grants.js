let router = require("express").Router();
const strings = require("../strings");
const secure = require("../database_operations/secureCode");
const grants = require("../database_operations/grants");

router.post("/grantUser", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("GRANT");
  try {
    secure.protectFunctionType(
      secureCode,
      () => {
        console.log("SECURE PASS");
        grants.grantUser(req.body.BID, req.body.Time_end, req.body.Type, (cb,err) => {
          if(err) return res.send(err);
          return res.send(cb);
        });
      },
      "Admin",
      access => {
        if (access == strings.s_accessForbitten)
          return res.send(strings.s_accessForbitten);
      }
    );
  } catch (Ex) {
    console.error("ERROR ON GRANT:", ex.message);
    return res.send("there were errors");
  }
});

module.exports = router;
