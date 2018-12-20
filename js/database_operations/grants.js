const users = require("../database_operations/users");
const sqlstring = require("sqlstring");
const db = require("../database");

module.exports.grantUser = function grantUser(
  BID,
  Time_end,
  Type,
  callback = (callback, error) => {}
) {
  db.query(
    `INSERT INTO ACC_TYPES(Bean_id, Time_end, Type)VALUES(${sqlstring.escape(BID)},${sqlstring.escape(Time_end)},${sqlstring.escape(Type)})`,
    (success, err) => {
      if (err) return callback(undefined, err);
      return callback("success",undefined);
    }
  );
};
