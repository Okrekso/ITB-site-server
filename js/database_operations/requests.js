const db = require("../database");
const users = require("../database_operations/users");
const mail = require("../mail");
const sqlstring = require("sqlstring");
// requiers

function createRequest(
  values = {
    Name,
    Email,
    Pass,
    Stud_group
  },
  callback = err => {}
) {
  db.query(
    `INSERT INTO Requests(Name,Email,Pass,Stud_group)VALUES(${sqlstring.escape(values.Name)},${
      sqlstring.escape(values.Email)
    },${sqlstring.escape(values.Pass)},${sqlstring.escape(values.Stud_group)})`,
    (res, err) => {
      callback(err);
    }
  );
}

function deleteRequest(ID, callback = err => {}) {
  db.query(`REMOVE FROM Requests WHERE ID=${sqlstring.escape(ID)}`, (res, err) => {
    callback(err);
  });
}

function acceptUser(RequestID) {
  db.query(`SELECT * FROM Requests WHERE ID=${sqlstring.escape(RequestID)}`, (res, err) => {
	if(res.length<=0) return;
    let values = { Name: res[0].Name, Email: res[0].Email, Pass: res[0].Pass };
    users.createNewUser(values, err => {
      if (!err) console.log("successfuly create new user:", res);
      if (res.length > 0) {
        db.query(`DELETE FROM Requests WHERE ID=${sqlstring.escape(RequestID)}`);
      }
    });
  });
}

function declineUser(RequestID) {
  db.query(`SELECT Email FROM Requests WHERE ID=${sqlstring.escape(RequestID)}`, (res, err) => {
    if (res[0]!=undefined && res.length > 0)
      db.query(`DELETE FROM Requests WHERE ID=${sqlstring.escape(RequestID)}`, (result, err) => {
        mail.sendDecline(res[0].Email, (err, info) => {
          if (err) return console.log("error");
        });
      });
  });
}

function getRequests(callback = requests => {}) {
  db.query(`SELECT * FROM Requests`, (res, err) => {
    if (err) return callback(err);
    callback(res);
  });
}

module.exports.acceptUser = acceptUser;
module.exports.createRequest = createRequest;
module.exports.getRequests = getRequests;
module.exports.declineUser = declineUser;
