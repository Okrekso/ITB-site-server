const db = require("../database");
const users = require("../database_operations/users");
const sqlstring = require("sqlstring");

function becomeSanta(userID) {
  console.log("start creating new santa");
  users.getUsers(users => {
    let id = userID;
    while (id == userID || id==undefined) {
      id = users[Math.floor(Math.random() * users.length)].Id;
    }
    console.log(`new santa created for ${userID}`);

    db.query(
      `INSERT INTO e_santa(SantaID, FriendID)VALUES(${userID},${id})`,
      (res, err) => {}
    );
  });
}

module.exports.getSantas = function(callback = santas => {}) {
  db.query(`CALL GetSantas`, santas => {
    callback(santas[0]);
  });
};
module.exports.findMySanta = function(userID, callback = res => {}) {
  userID = sqlstring.escape(userID);
  db.query(
    `SELECT Name FROM USERS as u INNER JOIN e_santas as s ON s.FriendID=u.Id WHERE s.FriendID=${user.Id} AND Shown=1`,
    (result, err) => {
      if(result[0]==undefined) callback("your santa is hidden :)");
    }
  );
};

module.exports.findMyFriend = function(secureCode, callback = friend => {}) {
  console.log(secureCode, "finding santa");
  users.findUserBySecure(secureCode, (user)=>{
    if(user[0]==undefined) return;
    userID = user['Id'];
    db.query(`SELECT Name FROM USERS as u INNER JOIN e_santas as s ON s.FriendID=u.Id WHERE s.SantaID=${user.Id}`,(friend)=>{
      if(friend[0]==undefined) return becomeSanta(userID);
      callback(friend[0].Name);
    });
  });
};
