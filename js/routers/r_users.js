const users = require("../database_operations/users");
let router = require("express").Router();

router.post("/newUser", (req, res) => {
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

  router.get("/all_users", (req, res) => {
    users.getUsers(users => {
      res.send(users);
    });
  });
  
  router.get("/user_byId", (req, res) => {
    let requestID = req.query.ID;
    users.findUserById(requestID, user => {
      res.send(user);
    });
  });
  router.get("/user_bySecure", (req, res) => {
    let secureCode = req.query.secureCode;
    users.findUserBySecure(secureCode, user => {
      res.send(user);
    });
  });

  router.get("/accessLevel", (req, res) => {
    let secureCode = req.query.secureCode;
    secure.getAccessLevel(secureCode, result => {
      res.send(result.toString());
    });
  });
  
  router.get("/login", (req, res) => {
    let email = req.query.email;
    let pass = req.query.pass;
    users.login(email, pass, (secureCode, err) => {
      if (err) return res.send(err);
      res.send(secureCode);
    });
  });

  module.exports = router;