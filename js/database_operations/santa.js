const db = require("../database");
const users = require("../database_operations/users");
const sqlstring = require("sqlstring");

function becomeSanta(userID) {
  users.getUsers(users => {
    let id = userID;
    while (id == userID) {
      id = users[Math.floor(Math.random() * users.length) + 0].ID;
      console.log(`new santa created for ${userID}, his friend is ${id}`);
    }

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
module.exports.findMySanta = function(userID, callback=(res)=>{}) {
  userID = sqlstring.escape(userID);
  db.query(
    `SELECT * FROM e_santas WHERE santaID = ${userID}`,
    (result, err) => {
      if (result.length == 0) becomeSanta(userID);
      else callback("you are already santa!");
    }
  );
};
