const request = require("../database_operations/requests");
const secure = require("../database_operations/secureCode");
let router = require("express").Router();
const strings = require("../strings");

router.post("/new", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let pass = req.body.pass;
  let studGroup = req.body.stud_group;

  request.createRequest(
    { Name: name, Email: email, Pass: pass, Stud_group: studGroup },
    err => {
      if (err) {
        res.send("error" + err);
      } else res.send("success!");
    }
  );
});

router.get("/get", (req, res) => {
  let secureCode = req.query.secureCode;
  secure.protectFunctionType(
    secureCode,
    () => {
      request.getRequests(requests => {
        if (requests) return res.send(requests);
      });
    },
    "Admin",
    access_result => {
      if (!access_result) return res.send(strings.s_accessForbitten);
    }
  );
});

router.post("/accept", (req, res) => {
  let request_ID = req.body.request_ID;
  let secureCode = req.body.secureCode;

  secure.protectFunctionType(
    secureCode,
    () => {
      request.acceptUser(request_ID);
      res.send("accepted");
    },
    "Admin",
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

router.post("/decline", (req, res) => {
  let request_ID = req.body.request_ID;
  let secureCode = req.body.secureCode;
  console.log("decline", request_ID, secureCode);
  secure.protectFunctionType(
    secureCode,
    () => {
      request.declineUser(request_ID);
      res.send("declined");
    },
    "Admin",
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

module.exports = router;
