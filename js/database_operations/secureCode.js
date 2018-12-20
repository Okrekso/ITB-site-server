const db = require("../database");
const sqlstring = require("sqlstring");
const users = require("./users");
// requiers

function getBeanType(secureCode, callback = beanType => {}) {
  db.query(
    `SELECT Xp FROM USERS WHERE Secure_code=${sqlstring.escape(secureCode)}`,
    (res, err) => {
      if (res == undefined || res[0] == undefined) return callback(-1);

      let Xp = parseInt(res[0].Xp);
      if (Xp < 40) {
        return callback("Green");
      }
      if (Xp >= 40 && Xp < 80) {
        return callback("Orange");
      }
      if (Xp >= 80 && Xp < 120) {
        return callback("Golden");
      }
      if (Xp >= 120 && Xp < 200) {
        return callback("Diamond");
      }
      if (Xp >= 200) {
        return callback("Legendary");
      }
    }
  );
}

function beanTypeToInt(beanType) {
  if (beanType == "Green") return 0;
  if (beanType == "Orange") return 1;
  if (beanType == "Golden") return 2;
  if (beanType == "Diamond") return 3;
  if (beanType == "Legendary") return 4;
  return -1;
}

function protectFunctionType(
  secureCode,
  func = () => {},
  requiredType = "",
  callback = access_result => {}
) {
  users.findUserBySecure(secureCode, user => {
    let accType = user.Acc_type;
    if (accType != undefined && accType != null)
      if (requiredType.split(", ").indexOf(accType) != -1) {
        callback(1);
        func();
        return;
      }
    return callback(0);
  });
}
function protectFunction(
  secureCode,
  func = () => {},
  minProtectionLevel = 0,
  callback = access_result => {}
) {
  getBeanType(secureCode, beanType => {
    if (
      beanTypeToInt(beanType) >= isNaN(parseInt(minProtectionLevel))
        ? beanTypeToInt(minProtectionLevel)
        : minProtectionLevel
    ) {
      callback(1);
      func();
      return;
    } else {
      callback(0);
      return;
    }
  });
}

module.exports.getBeanType = getBeanType;
module.exports.protectFunction = protectFunction;
module.exports.protectFunctionType = protectFunctionType;
