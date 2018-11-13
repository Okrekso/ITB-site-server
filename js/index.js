const express = require("express");
const db = require("./database");
const users = require("./database_operations/users");
const events = require("./database_operations/events");
const visits = require("./database_operations/visits");
const drops = require("./database_operations/drops");
const secure = require("./database_operations/secureCode");
const request = require("./database_operations/requests");
const mail = require("./mail");
const strings = require("./strings");
// requiers

// strings
var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", strings.s_site);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("https://itb-server.herokuapp.com/", (req, res) => {
  res.send(
    "<h1>IT B.E.A.N.S. Database Access Server</h1><p>here you can access data of it b.e.a.n.s., but better do it in our site: <a href='http://itbeans.online'>http://itbeans.online</a>"
  );
});

app.get("/chekDropAvailability", (req, res) => {
  drops.checkDropAvailability(result => {
    res.send(result);
  });
});
app.post("/addDrop", (req, res) => {
  let secureCode = req.body.secureCode;
  secure.protectFunction(
    secureCode,
    () => {
      drops.checkDropAvailability(result => {
        if (result == true) {
          drops.addDrop();
          res.send("success");
        } else res.send(strings.s_notTime);
      });
    },
    3,
    access_result => {
      if (!access_result) return res.send(strings.s_accessForbitten);
    }
  );
});

app.post("/acceptPayment", (req, res) => {
  console.log(req.body.data, req.body.signature);
});
// users
app.get("/all_users", (req, res) => {
  users.getUsers(users => {
    res.send(users);
  });
});

app.get("/user_byId", (req, res) => {
  let requestID = req.query.ID;
  users.findUserById(requestID, user => {
    res.send(user);
  });
});
app.get("/user_bySecure", (req, res) => {
  let secureCode = req.query.secureCode;
  users.findUserBySecure(secureCode, user => {
    res.send(user);
  });
});

app.get("/accessLevel", (req, res) => {
  let secureCode = req.query.secureCode;
  secure.getAccessLevel(secureCode, result => {
    res.send(result.toString());
  });
});

app.get("/login", (req, res) => {
  let email = req.query.email;
  let pass = req.query.pass;
  users.login(email, pass, (secureCode, err) => {
    if (err) return res.send(err);
    res.send(secureCode);
  });
});

app.post("/newUser", (req, res) => {
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

// events
app.get("/all_Events", (req, res) => {
  events.getEvents(events => {
    res.send(events);
  });
});

app.get("/creator_events", (req, res) => {
  users.findUserBySecure(req.query.secureCode, user => {
    if (user)
      events.getEventsByCreator(user.Id, events => {
        res.send(events);
      });
  });
});

app.post("/newEvent", (req, res) => {
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

app.post("/removeEvent", (req, res) => {
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

app.post("/editEvent", (req, res) => {
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
// visits

app.post("/addVisit", (req, res) => {
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

app.post("/removeVisit", (req, res) => {
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

app.get("/getVisitsOnEvent", (req, res) => {
  let eventID = req.query.eventID;
  visits.selectVisitsOnEvent(eventID, (result, err) => {
    res.send(result);
  });
});

// requests

app.post("/newRequest", (req, res) => {
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

app.get("/getRequests", (req, res) => {
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

app.post("/acceptRequest", (req, res) => {
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

app.post("/declineRequest", (req, res) => {
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

app.get("/forgetPass", (req, res) => {
  let to = req.query.email;
  users.changeSecure(to, (newSecure, err) => {
    if (err) {
      res.send(err);
      return console.log(err);
    }

    mail.sendPassword(to, newSecure, (err, info) => {
      console.log("mail sent:", info);
      res.send("mail sent");
    });
  });
});

app.post("/changePassBySecure", (req, res) => {
  let addSecureCode = req.body.addSecureCode;
  let newPass = req.body.newPass;
  users.changeBySecure(addSecureCode, newPass, result => {
    res.send(result);
  });
});

app.listen(3000);
