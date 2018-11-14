let router = require("express").Router();

router.get("/", (req, res) => {
  res.send(
    "<h1>IT B.E.A.N.S. Database Access Server</h1><p>here you can access data of it b.e.a.n.s., but better do it in our site: <a href='http://itbeans.online'>http://itbeans.online</a>"
  );
});

router.get("/forgetPass", (req, res) => {
  let to = req.query.email;
  users.changeSecure(to, (newSecure, err) => {
    if (err) {
      res.send(err);
      return console.log(err);
    }

    mail.sendPassword(to, newSecure, (err, info) => {
      console.log("mail sent:", info);
      res.send("mail sent");
    });
  });
});

router.post("/changePassBySecure", (req, res) => {
  let addSecureCode = req.body.addSecureCode;
  let newPass = req.body.newPass;
  users.changeBySecure(addSecureCode, newPass, result => {
    res.send(result);
  });
});

module.exports = router;
