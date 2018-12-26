const nodemailer = require("nodemailer");
const db = require("./database");
const strings = require("./strings");
// requiers
var default_from = '"IT BEANS Club💻" <support@itbeans.online>';
var siteURL = "test.itbns";

function defaultCallback(err, info) {
  if (err) {
    return console.log(err);
  }
  console.log("mail sent:", info);
}

function sendMail(
  mailOptions = {
    from: default_from,
    to: "",
    subject: "",
    text: ""
  },
  callback = defaultCallback
) {
  var transporter = nodemailer.createTransport({
    host: "mx1.hostinger.com",
    port: 587,
    auth: {
      user: "support@itbeans.xyz",
      pass: process.env.emailPass
    }
  });

  transporter.sendMail(mailOptions, (err, info) => {
    callback(err, info);
  });
}

function sendPassword(to, newSecure, callback = defaultCallback) {
  mailOptions = {
    from: default_from,
    to: to,
    subject: "Password change",
    html: `<b>Hello! It's IT Beans club!</b><br> We've detected that you want to change your password. If you doesn't change your mind folow this link to do this:<a href='${
      strings.s_site[0]
    }/account/?change=${newSecure}'>link</a>`
  };
  sendMail(mailOptions, (err, info) => {
    callback(err, info);
  });
}

function sendHello(to, callback = defaultCallback) {
  mailOptions = {
    from: default_from,
    to: to,
    subject: "Welcome to the club, buddy!",
    html: `<b>Hello! It's IT Beans club!</b> We are glad to congratulate you with membership in our club! This is amaizing! Now you can enter your account in this <a href='http://${siteURL}/account/'>link</a>`
  };
  sendMail(mailOptions);
}

function sendDecline(to, callback = defaultCallback) {
  mailOptions = {
    from: default_from,
    to: to,
    subject: "Sorry, but club is closed for you...",
    html:
      "<b>Hello! It's IT Beans club!</b> your request to the club was declined by administration. Please connect with us in facebook: https://www.facebook.com/ITBeans"
  };
  sendMail(mailOptions);
}

module.exports.sendPassword = sendPassword;
module.exports.sendMail = sendMail;
module.exports.sendHello = sendHello;
module.exports.sendDecline = sendDecline;
