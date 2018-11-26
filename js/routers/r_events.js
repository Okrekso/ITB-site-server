const events = require("../database_operations/events");
const secure = require("../database_operations/secureCode");
const users = require("../database_operations/users");
let router = require("express").Router();
const strings = require("../strings");

router.get("/get(/:searchValue)?", (req, res) => {
  if (req.params.searchValue == undefined) {
    events.getEvents(events => {
      res.send(events);
    });
    return;
  }
  if (isNaN(parseInt(req.params.searchValue))) {
    users.findUserBySecure(req.params.searchValue, user => {
      if (user)
        events.getEventsByCreator(user.Id, events => {
          res.send(events);
        });
    });
    return;
  } else {
    events.getEventById(req.params.searchValue, event => {
      res.send(event);
    });
    return;
  }
});

router.post("/new", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("new event from", secureCode);
  secure.protectFunctionType(
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
    "Speaker, Admin",
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
      }
    }
  );
});

router.post("/remove", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("event deleted");
  secure.protectFunctionType(
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
    "Speaker, Admin",
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
        console.log("no access for function");
      }
    }
  );
});

router.post("/edit", (req, res) => {
  let secureCode = req.body.secureCode;
  console.log("event edited");
  secure.protectFunctionType(
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
    "Speaker, Admin",
    access_result => {
      if (!access_result) {
        res.send(strings.s_accessForbitten);
        console.log("no access for function");
      }
    }
  );
});

module.exports = router;
