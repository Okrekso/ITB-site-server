let router = require("express").Router();
const santa = require("../database_operations/santa");
const users = require("../database_operations/users");

router.get("/get",(req,res)=>{
    santa.getSantas((santas)=>{
        res.send(santas);
    })
});

router.post("/become", (req,res)=>{
    let secureCode = req.body.secureCode;
    users.findUserBySecure(secureCode,(user)=>{
        santa.findMySanta(user.Id,(result)=>{
            console.log("santa result:",result);
            res.send(result);
        });
    });
});

