const db = require('../database');
// requiers

function getAccessLevel(secureCode, callback = (accessLevel) => {}) {
	db.query(`SELECT Xp FROM USERS WHERE Secure_code='${secureCode}'`, (res, err) => {
		if(res==undefined || res[0]==undefined) return callback(-1);

		let Xp = parseInt(res[0].Xp);
		if (res == undefined) {
			return callback(0);
		}
		if (Xp < 40) {
			return callback(0);
		}
		if (Xp >= 40 && Xp < 80) {
			return callback(1);
		}
		if (Xp >= 80 && Xp < 120) {
			return callback(2);
		}
		if(Xp>=120 && Xp<200){
			return callback(3);
		}
		if(Xp>=200){
			return callback(4);
		}
	});
}

function protectFunction(secureCode, func = () => {}, minProtectionLevel = 0, callback = (access_result) => {}) {
	getAccessLevel(secureCode, (accessLevel) => {
		if (accessLevel >= minProtectionLevel) {
			func();
			callback(1);
			return;
		} else {
			callback(0);
			return;
		}
	});
}

module.exports.getAccessLevel = getAccessLevel;
module.exports.protectFunction = protectFunction;
