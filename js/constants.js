// SQL
module.exports.s_secureEncode = process.env.secureEncode;
module.exports.host = process.env.DB_Host;
module.exports.user = process.env.DB_User;
module.exports.pass = process.env.DB_Pass;
// Email
module.exports.e_port = 587;
module.exports.e_host = "mx1.hostinger.com";
module.exports.e_user = "support@itbeans.xyz";
module.exports.e_pass = process.env.emailPass;
// Server global
module.exports.port = process.env.PORT;
