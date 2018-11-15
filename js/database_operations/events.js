const db = require("../database");
const users = require("../database_operations/users");
const sqlstring = require("sqlstring");
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
      `INSERT INTO EVENTS(Header,Content,Date_when,Xp,Creator)VALUES(${
        sqlstring.escape(values.Header)
      },${sqlstring.escape(values.Content)},${sqlstring.escape(values.Date_when)},${sqlstring.escape(values.Xp)},${sqlstring.escape(user.Id)})`,
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
  db.query(`SELECT * FROM EVENTS WHERE ID=${sqlstring.escape(Id)}`, (event,err) => {
    if(err) callback(err);
    callback(event[0]);
  });
}

function getEventsByCreator(CreatorID, callback=events=>{}){
  db.query(`SELECT * FROM EVENTS WHERE Creator=${sqlstring.escape(CreatorID)}`, (events,err)=>{
    if(err) return callback(err);
    callback(events);
  });
}

function removeEvent(Id, callback = () => {}) {
  db.query(`DELETE FROM EVENTS WHERE ID=${sqlstring.escape(Id)}`, (res, err) => {
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
  addValue("Header", sqlstring.escape(newValues.Header));
  addValue("Content", sqlstring.escape(newValues.Content));
  addValue("Date_when", sqlstring.escape(newValues.Date_when));
  addValue("Xp", sqlstring.escape(newValues.Xp), false);

  query += ` WHERE ID = ${sqlstring.escape(Id)}`;
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
