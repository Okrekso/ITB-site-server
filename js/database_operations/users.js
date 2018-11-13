const db = require("../database");
const strings = require("../strings");
const mail = require("../mail");
const secure = require("../database_operations/secureCode");
// requiers
function findUserBySecure(secureCode, callback = result => {}) {
  secure.getAccessLevel(secureCode, accessLevel => {
    db.query(
      `SELECT Id,Name,Email,Xp,${accessLevel} as Access_lvl, getType(Id) as Acc_type, (SELECT SUM(Xp) FROM GIFTS WHERE Bean_id=USERS.ID) AS Gifts, (SELECT SUM(Xp) FROM EVENTS WHERE ID IN (SELECT Event_id FROM VISITIONS WHERE Bean_id = USERS.ID)) AS Visits, (SELECT COUNT(ID) FROM VISITIONS WHERE Bean_id = USERS.ID) AS Visits_count FROM USERS WHERE Secure_code='${secureCode}'`,
      result => {
        callback(result[0]);
      }
    );
  });
}

function findUserById(Id, callback = result => {}) {
  db.query(
    `SELECT Id,Name,Email,Xp, getType(Id) as Acc_type, (SELECT SUM(Xp) FROM GIFTS WHERE Bean_id=USERS.ID) AS Gifts, (SELECT SUM(Xp) FROM EVENTS WHERE ID IN (SELECT Event_id FROM VISITIONS WHERE Bean_id = USERS.ID)) AS Visits, (SELECT COUNT(ID) FROM VISITIONS WHERE Bean_id = USERS.ID) AS Visits_count FROM USERS WHERE ID=${Id}`,
    result => {
      callback(result[0]);
    }
  );
}

function login(email, pass, callback = (secureCode, err) => {}) {
  db.query(
    `SELECT Secure_code FROM USERS WHERE Email='${email}' AND Pass=encode('${pass}','${
      strings.s_secureEncode
    }') LIMIT 1`,
    (res, err) => {
      callback(res, err);
    }
  );
}

function getUsers(callback = result => {}) {
  db.query(
    "SELECT ID,Name,Email,Xp, getType(Id) as Acc_type FROM `USERS` ORDER BY Name ASC",
    result => {
      callback(result);
    }
  );
}

function generateSecureCode() {
  function randomize(min, max) {
    max += 1;
    i = Math.floor(Math.random() * max) + min;
    return i;
  }
  let code = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 20; i++) {
    char = possible.charAt(randomize(0, possible.length));
    code += char;
  }
  return code;
}

function createNewUser(
  values = {
    Name: "",
    Email: "",
    Pass: ""
  },
  callback = err => {}
) {
  date = new Date();
  date = date.toLocaleString();
  db.query(
    `INSERT INTO USERS(Secure_code, Name, Email, Pass, Register_date) VALUES ('${generateSecureCode()}','${
      values.Name
    }','${values.Email}',ENCODE('${values.Pass}','${
      strings.s_secureEncode
    }'),'${date}')`,
    (result, err) => {
      console.log("success created new user:" + values.Name);
      callback(err);
    }
  );
  mail.sendHello(values.Email);
}

function changeSecure(Email, callback = (newSecureCode, err) => {}) {
  let newSecure = generateSecureCode();
  db.query(
    `SELECT Last_change FROM USERS WHERE Email='${Email}' LIMIT 1`,
    (res, err) => {
      if (res.length == 0) return callback(null, strings.s_userNotFound);

      let lastChange = new Date(res[0].Last_change);
      let now = new Date();
      let dateDiff = new Date(now - lastChange);
      let secondsDiff = dateDiff.getTime() / 1000;

      if (secondsDiff > 100) {
        db.query(
          `UPDATE USERS SET Secure_code_extra='${newSecure}' WHERE Email='${Email}'`,
          (res, err) => {
            console.log(res);
            callback(newSecure, err);
          }
        );
      } else return callback(null, strings.s_notTime);
    }
  );
}
function changeBySecure(addSecure, newPass, callback = result => {}) {
  db.query(
    `UPDATE USERS SET Pass=ENCODE('${newPass}','${strings.s_secureEncode}'), Secure_code='${addSecure}', Secure_code_extra=null WHERE Secure_code_extra='${addSecure}'`,
    (res, err) => {
      if (err) return callback(err);
      callback("pass changed");
    }
  );
}

module.exports.changeBySecure = changeBySecure;
module.exports.getUsers = getUsers;
module.exports.findUserBySecure = findUserBySecure;
module.exports.findUserById = findUserById;
module.exports.createNewUser = createNewUser;
module.exports.login = login;
module.exports.changeSecure = changeSecure;
