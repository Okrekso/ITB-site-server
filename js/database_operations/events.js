const db = require("../database");
const users = require("../database_operations/users");
// requiers
function createEvent(
  values = {
    Header,
    Content,
    Picture_href,
    Date_when,
    Color,
    Xp,
    Creator
  },
  secureCode,
  callback = res => {}
) {
  users.findUserBySecure(secureCode, user => {
    console.log(values, user);
    db.query(
      `INSERT INTO EVENTS(Header,Content,Date_when,Xp,Creator)VALUES('${
        values.Header
      }','${values.Content}','${values.Date_when}',${values.Xp},${user.Id})`,
      (result, err) => {
        if (err) {
          callback(err);
          return;
        } else {
          callback(`${values.Header} created!`);
        }
      }
    );
  });
}

function getEvents(callback = result => {}) {
  db.query("SELECT * FROM EVENTS ORDER BY ID DESC", events => {
    callback(events);
  });
}

function getEventById(Id, callback = result => {}) {
  db.query(`SELECT * FROM EVENTS WHERE ID=${Id}`, (event,err) => {
    if(err) callback(err);
    callback(event[0]);
  });
}

function getEventsByCreator(CreatorID, callback=events=>{}){
  db.query(`SELECT * FROM EVENTS WHERE Creator=${CreatorID}`, (events,err)=>{
    if(err) return callback(err);
    callback(events);
  });
}

function removeEvent(Id, callback = () => {}) {
  db.query(`DELETE FROM EVENTS WHERE ID=${Id}`, (res, err) => {
    if (err) return callback(err);
    callback(res);
  });
}

function updateEvent(Id, newValues, callback = result => {}) {
  let query = "UPDATE EVENTS SET";
  function addValue(valName, val, coma = true, string = true) {
    if (val)
      query += string
        ? ` ${valName} = '${val}'${coma ? "," : ""}`
        : ` ${valName} = ${val}${coma ? "," : ""}`;
  }
  addValue("Header", newValues.Header);
  addValue("Content", newValues.Content);
  addValue("Date_when", newValues.Date_when);
  addValue("Xp", newValues.Xp, false);

  query += ` WHERE ID = ${Id}`;
  console.log(query);
  db.query(query, (res, err) => {
    if (err) return callback(err);
    callback("success");
  });
}

module.exports.getEvents = getEvents;
module.exports.getEventsByCreator = getEventsByCreator;
module.exports.getEventById = getEventById;
module.exports.createEvent = createEvent;
module.exports.updateEvent = updateEvent;
module.exports.removeEvent = removeEvent;
