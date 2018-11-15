const users = require("../database_operations/users");
const secure = require("../database_operations/secureCode");
const db =require("../database");
let router = require("express").Router();
const sqlstring = require("sqlstring");

router.post("/new", (req, res) => {
  let name = req.query.name;
  let email = req.query.email;
  let pass = req.query.pass;

  let secureCode = req.query.secureCode;
  secure.protectFunction(
    secureCode,
    () => {
      users.createNewUser(
        {
          Name: name,
          Email: email,
          Pass: pass
        },
        result => {
          if (result == "success") res.send("created!");
        }
      );
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

router.get("/get(/:searchValue)?", (req, res) => {
  if (req.params.searchValue == undefined) {
    users.getUsers(users => {
      console.log("all");
      return res.send(users);
    });
    return;
  }
  if (isNaN(parseInt(req.params.searchValue))) {
    console.log("secure", req.params.searchValue);
    users.findUserBySecure(req.params.searchValue, user => {
      return res.send(user);
    });
    return;
  } else {
    console.log("id");
    users.findUserById(req.params.searchValue, user => {
      return res.send(user);
    });
    return;
  }
});

router.get("/accessLevel", (req, res) => {
  let secureCode = req.query.secureCode;
  secure.getAccessLevel(secureCode, result => {
    return res.send(result.toString());
  });
});

router.get("/login", (req, res) => {
  let email = req.query.email;
  let pass = req.query.pass;
  users.login(email, pass, (secureCode, err) => {
    if (err) return res.send(err);
    return res.send(secureCode);
  });
});

module.exports = router;
