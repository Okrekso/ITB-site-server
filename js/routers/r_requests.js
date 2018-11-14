const request = require("../database_operations/requests");
let router = require("express").Router();

router.post("/newRequest", (req, res) => {
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

router.get("/getRequests", (req, res) => {
  let secureCode = req.query.secureCode;
  secure.protectFunction(
    secureCode,
    () => {
      request.getRequests(requests => {
        if (requests) res.send(requests);
      });
    },
    4,
    access_result => {
      if (!access_result) return res.send(strings.s_accessForbitten);
    }
  );
});

router.post("/acceptRequest", (req, res) => {
  let request_ID = req.body.request_ID;
  let secureCode = req.body.secureCode;

  secure.protectFunction(
    secureCode,
    () => {
      request.acceptUser(request_ID);
      res.send("accepted");
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

router.post("/declineRequest", (req, res) => {
  let request_ID = req.body.request_ID;
  let secureCode = req.body.secureCode;
  console.log("decline", request_ID, secureCode);
  secure.protectFunction(
    secureCode,
    () => {
      request.declineUser(request_ID);
      res.send("declined");
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

module.exports = router;
