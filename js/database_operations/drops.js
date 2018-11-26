const db = require("../database");
const secure = require("../database_operations/secureCode");

function addDrop() {
  db.query(`INSERT INTO NULLS(Date_when)VALUES(NOW())`);
}
function checkDropAvailability(callback = (result = false) => {}) {
  db.query(
    `SELECT ID FROM NULLS WHERE DATEDIFF(NOW(),Date_when)<70`,
    (result, err) => {
      console.log("drop chek",result);
      if(result==undefined || result==[]) callback(true);
      if (result.length == 0) return callback(true);
      return callback(false);
    }
  );
}

module.exports.checkDropAvailability = checkDropAvailability;
module.exports.addDrop = addDrop;
