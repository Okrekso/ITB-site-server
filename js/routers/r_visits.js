const visits = require("../database_operations/visits");
let router = require("express").Router();

router.post("/addVisit", (req, res) => {
  let beanID = req.body.beanID;
  let eventID = req.body.eventID;
  let secureCode = req.body.secureCode;
  secure.protectFunction(
    secureCode,
    () => {
      console.log(beanID, eventID);
      visits.addVisit(secureCode, beanID, eventID, err => {
        console.log("error", err);
        if (!err) res.send(`added visit for ${beanID} on event ${eventID}`);
        else res.send(err);
      });
    },
    2,
    access_result => {
      console.log(access_result);
      if (!access_result) {
        return res.send(strings.s_accessForbitten);
      }
    }
  );
});

router.post("/removeVisit", (req, res) => {
  let beanID = req.body.beanID;
  let eventID = req.body.eventID;
  let secureCode = req.body.secureCode;

  secure.protectFunction(
    secureCode,
    () => {
      visits.removeVisit(secureCode, beanID, eventID, err => {
        if (!err) res.send(`removed visit for ${beanID} on event ${eventID}`);
        else res.send(err);
      });
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

router.get("/getVisitsOnEvent", (req, res) => {
  let eventID = req.query.eventID;
  visits.selectVisitsOnEvent(eventID, (result, err) => {
    res.send(result);
  });
});

module.exports = router;
