const db = require("../database");
const events = require("../database_operations/events");
const users = require("../database_operations/users");
const strings = require("../strings");
// requiers
function addVisit(secureCode, beanID, eventID, callback = error => {}) {
  events.getEventById(eventID, event => {
    users.findUserBySecure(secureCode, user => {
      if (event && user)
        if (event.Creator == user.Id) {
          db.query(
            `INSERT INTO VISITIONS(Bean_id,Event_id) VALUES(${beanID},${eventID})`,
            (res, err) => {
              return callback(err);
            }
          );
        } else {
          return callback(strings.s_accessForbitten);
        }
    });
  });
}

function removeVisit(secureCode, beanID, eventID, callback = error => {}) {
  events.getEventById(eventID, event => {
    users.findUserBySecure(secureCode, user => {
      if (event && user)
        if (event.Creator == user.Id) {
          db.query(
            `DELETE FROM VISITIONS WHERE Bean_id=${beanID} AND Event_id=${eventID}`,
            (res, err) => {
              callback(err);
            }
          );
        } else {
          return callback(strings.s_accessForbitten);
        }
    });
  });
}

function selectVisitsOnEvent(eventID, callback = (result, error) => {}) {
  db.query(`SELECT * FROM VISITIONS WHERE Event_id=${eventID}`, (res, err) => {
    callback(res, err);
  });
}

module.exports.addVisit = addVisit;
module.exports.removeVisit = removeVisit;
module.exports.selectVisitsOnEvent = selectVisitsOnEvent;
