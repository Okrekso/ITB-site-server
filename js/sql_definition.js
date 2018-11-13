const mysql = require('mysql');
// requiers

let host = 'localhost';
let user = 'u380338396_mstr';
let pass = process.env.DB_Pass;
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
