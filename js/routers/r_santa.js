let router = require("express").Router();
const santa = require("../database_operations/santa");
const users = require("../database_operations/users");

router.get("/get", (req, res) => {
  santa.getSantas(santas => {
    res.send(santas);
  });
});

router.get("/get/:secureCode", (req, res) => {
  console.log("finding uniq friend:", req.params.secureCode);
  santa.findMyFriend(req.params.secureCode, friend => {
    res.send(friend);
  });
});

router.get("/get/santa/:secureCode", (req, res) => {
  secureCode = req.params.secureCode;
  console.log("finding uniq santa:", secureCode);
  santa.findMySanta(secureCode, yourSanta => {
    res.send(yourSanta);
  });
});

router.post("/become", (req, res) => {
  let secureCode = req.body.secureCode;
  users.findUserBySecure(secureCode, user => {
    santa.findMySanta(user.Id, result => {
      console.log("santa result:", result);
      res.send(result);
    });
  });
});

module.exports = router;
