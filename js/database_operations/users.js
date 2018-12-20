const db = require("../database");
const strings = require("../strings");
const mail = require("../mail");
const secure = require("../database_operations/secureCode");
const sqlstring = require("sqlstring");
// requiers
function findUserBySecure(secureCode, callback = result => {}) {
  secure.getBeanType(secureCode, beanType => {
    db.query(
      `SELECT Id,Name,Email,Xp,${sqlstring.escape(
        beanType
      )} as Bean_type, getType(Id) as Acc_type, (SELECT SUM(Xp) FROM GIFTS WHERE Bean_id=USERS.ID) AS Gifts, (SELECT SUM(Xp) FROM EVENTS WHERE ID IN (SELECT Event_id FROM VISITIONS WHERE Bean_id = USERS.ID)) AS Visits, (SELECT COUNT(ID) FROM VISITIONS WHERE Bean_id = USERS.ID) AS Visits_count FROM USERS WHERE Secure_code=${sqlstring.escape(
        secureCode
      )}`,
      result => {
        if (result != undefined) return callback(result[0]);
        return callback(undefined);
      }
    );
  });
}

function findUserById(Id, callback = result => {}) {
  db.query(
    `SELECT Id,Name,Email,Xp, getType(Id) as Acc_type, (SELECT SUM(Xp) FROM GIFTS WHERE Bean_id=USERS.ID) AS Gifts, (SELECT SUM(Xp) FROM EVENTS WHERE ID IN (SELECT Event_id FROM VISITIONS WHERE Bean_id = USERS.ID)) AS Visits, (SELECT COUNT(ID) FROM VISITIONS WHERE Bean_id = USERS.ID) AS Visits_count FROM USERS WHERE ID=${sqlstring.escape(
      Id
    )}`,
    result => {
      if (result != undefined) callback(result[0]);
      return callback(null);
    }
  );
}

function login(email, pass, callback = (secureCode, err) => {}) {
  const sqlstring = require("sqlstring");
  db.query(
    `SELECT Secure_code FROM USERS WHERE Email=${sqlstring.escape(
      email
    )} AND Pass=encode(${sqlstring.escape(pass)},${sqlstring.escape(
      strings.s_secureEncode
    )}) LIMIT 1`,
    (res, err) => {
      callback(res, err);
    }
  );
}

function getType(BID, callback = result => {}) {
  findUserById(BID, result => {
    if (BID != undefined)
      if (result != [] && result != null) return callback(result.Acc_type);
    return callback(null);
  });
}

function getUsers(callback = result => {}) {
  db.query(
    "SELECT ID,Name,Email,Xp, getType(Id) as Acc_type FROM `USERS` ORDER BY Name ASC",
    (result, err) => {
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
    `INSERT INTO USERS(Secure_code, Name, Email, Pass, Register_date) VALUES (${sqlstring.escape(
      generateSecureCode()
    )},${sqlstring.escape(values.Name)},${sqlstring.escape(
      values.Email
    )},ENCODE(${sqlstring.escape(values.Pass)},${sqlstring.escape(
      strings.s_secureEncode
    )}),${sqlstring.escape(date)})`,
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
    `SELECT Last_change FROM USERS WHERE Email=${sqlstring.escape(
      Email
    )} LIMIT 1`,
    (res, err) => {
      if (res.length == 0) return callback(null, strings.s_userNotFound);

      let lastChange = new Date(res[0].Last_change);
      let now = new Date();
      let dateDiff = new Date(now - lastChange);
      let secondsDiff = dateDiff.getTime() / 1000;

      if (secondsDiff > 100) {
        db.query(
          `UPDATE USERS SET Secure_code_extra=${sqlstring.escape(
            newSecure
          )} WHERE Email=${sqlstring.escape(Email)}`,
          (res, err) => {
            callback(newSecure, err);
          }
        );
      } else return callback(null, strings.s_notTime);
    }
  );
}
function changeBySecure(addSecure, newPass, callback = result => {}) {
  db.query(
    `UPDATE USERS SET Pass=ENCODE(${sqlstring.escape(
      newPass
    )},${sqlstring.escape(
      strings.s_secureEncode
    )}), Secure_code=${sqlstring.escape(
      addSecure
    )}, Secure_code_extra=null WHERE Secure_code_extra=${sqlstring.escape(
      addSecure
    )}`,
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
module.exports.getType = getType;
