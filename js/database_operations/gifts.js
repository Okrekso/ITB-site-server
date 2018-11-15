const db = require("../database");
const sqlstring = require("sqlstring");

module.exports.addGift = function(Bean_id, Xp, callback = () => {}) {
  return db.query(
    `INSERT INTO GIFTS(Bean_id,Xp)VALUES(${sqlstring.escape(Bean_id)},${sqlstring.escape(Xp)})`,
    (res, err) => {
        return callback("inserted gift");
    }
  );
};
