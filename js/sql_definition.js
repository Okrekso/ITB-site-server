const mysql = require('mysql');
// requiers

let host = require("./constants").host;
let user = require("./constants").user;
let pass = require("./constants").pass;
let database = 'u380338396_itb';

function getConnection() {
	let con = mysql.createConnection({
		host: host,
		user: user,
		password: pass,
		database: database
	});
	return con;
}

module.exports.connect = getConnection;
