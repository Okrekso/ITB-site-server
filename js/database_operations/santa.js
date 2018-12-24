const db = require("../database");
const users = require("../database_operations/users");
const sqlstring = require("sqlstring");

function becomeSanta(userID) {
  console.log("start creating new santa");
  module.exports.getFriends(friends => {
    users.getUsers(users => {
      let id = userID;
      while (
        id == userID ||
        id == undefined ||
        friends.filter(e => e == id).length != 0) {
        user = users[Math.floor(Math.random() * users.length)];
        console.log(user);
        id = user.ID;
      }
      console.log(`new santa created for ${userID}`);

      db.query(
        `INSERT INTO e_santas(SantaID, FriendID)VALUES(${userID},${id})`,
        (res, err) => {
          console.error(err);
        }
      );
    });
  });
}

module.exports.getSantas = function(callback = santas => {}) {
  db.query(`CALL GetSantas`, santas => {
    callback(santas[0]);
  });
};

module.exports.getFriends = function(callback = friends => {}) {
  db.query(`CALL GetFriends`, friends => {
    callback(friends[0]);
  });
};

module.exports.findMySanta = function(secureCode, callback = yourSanta => {}) {
  users.findUserBySecure(secureCode, user => {
    if (user == undefined) {
      return console.log("no such user", secureCode);
    }
    userID = user["Id"];
    db.query(
      `SELECT Name FROM USERS as u INNER JOIN e_santas as s ON s.SantaID=u.Id WHERE s.FriendID=${userID} AND Shown=1`,
      (result, err) => {
        if (result[0] == undefined) return callback("your santa is hidden :)");
        else return callback(result[0]);
      }
    );
  });
};

module.exports.findMyFriend = function(secureCode, callback = friend => {}) {
  console.log(secureCode, "finding santa");
  users.findUserBySecure(secureCode, user => {
    if (user == undefined) {
      console.log("no such user:", secureCode, user);
      return;
    }
    userID = user["Id"];
    db.query(
      `SELECT Name FROM USERS as u INNER JOIN e_santas as s ON s.FriendID=u.Id WHERE s.SantaID=${
        user.Id
      }`,
      friend => {
        console.log("friend:", friend);
        if (friend[0] == undefined) return becomeSanta(userID);
        callback(friend[0].Name);
      }
    );
  });
};
