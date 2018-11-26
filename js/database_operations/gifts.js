const db = require("../database");
const sqlstring = require("sqlstring");

module.exports.addGift = function(Bean_id, Xp, Sender, callback = () => {}) {
  return db.query(
    `INSERT INTO GIFTS(Bean_id,Xp,Time,Sender)VALUES(${sqlstring.escape(Bean_id)},${sqlstring.escape(Xp)},NOW(),${sqlstring.escape(Sender)})`,
    (res, err) => {
        return callback("inserted gift");
    }
  );
};
