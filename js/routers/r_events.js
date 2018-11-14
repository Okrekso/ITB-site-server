const events = require("../database_operations/events");
const secure = require("../database_operations/secureCode");

let router = require("express").Router();

router.get("/all_Events", (req, res) => {
  events.getEvents(events => {
    res.send(events);
  });
});

router.get("/creator_events", (req, res) => {
  users.findUserBySecure(req.query.secureCode, user => {
    if (user)
      events.getEventsByCreator(user.Id, events => {
        res.send(events);
      });
  });
});

router.post("/newEvent", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("new event from", secureCode);
  secure.protectFunction(
    secureCode,
    () => {
      let values = {
        Header: req.body.Header,
        Content: req.body.Content,
        Date_when: req.body.Date_when,
        Xp: req.body.Xp
      };
      events.createEvent(values, secureCode, event_res => {
        console.log(event_res);
        res.send(event_res);
      });
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
        console.log("no access for function");
      }
    }
  );
});

router.post("/removeEvent", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("event deleted");
  secure.protectFunction(
    secureCode,
    () => {
      users.findUserBySecure(secureCode, user => {
        events.getEventById(req.body.Id, event => {
          if (event && user)
            if (event.Creator == user.Id) {
              events.removeEvent(req.body.Id, result => {
                res.send("success");
              });
            } else return res.send(strings.s_accessForbitten);
        });
      });
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
        console.log("no access for function");
      }
    }
  );
});

router.post("/editEvent", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("event edited");
  secure.protectFunction(
    secureCode,
    () => {
      let values = {
        Header: req.body.Header,
        Content: req.body.Content,
        Xp: req.body.Xp,
        Date_when: req.body.Date_when
      };
      users.findUserBySecure(secureCode, user => {
        events.getEventById(req.body.Id, event => {
          if (event && user)
            if (event.Creator == user.Id) {
              events.updateEvent(req.body.Id, values, event_res => {
                res.send(event_res);
              });
            } else return res.send(strings.s_accessForbitten);
        });
      });
    },
    2,
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
        console.log("no access for function");
      }
    }
  );
});

module.exports = router;
