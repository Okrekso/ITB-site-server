const mysql = require('mysql');
// requiers

let host = process.env.DB_Host;
let user = process.env.DB_User;
let pass = process.env.DB_Pass;
// let host = "localhost";
// let user = "root";
// let pass = "";
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
