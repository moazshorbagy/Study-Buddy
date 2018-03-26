var mysql   = require("mysql");
var bcrypt = require('bcryptjs');
var config = require('./config');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var express = require("express");
var VerifyToken = require('./auth-controller/VerifyToken.js');

function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection) {
    
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
     
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.post("/users",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var salt = bcrypt.genSaltSync(10);
        var hashedpassword = bcrypt.hashSync(req.body.password, salt);
        var table = ["user_login","user_email","user_password",req.body.email,hashedpassword];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.dir(err.code);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });
    router.get("/users", VerifyToken, function(req, res){
        var query = "SELECT * FROM ??";
        var table = ["user_login"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows){
            if(err) res.json({"Error":true,"Message":"Error executing MySQL query"});
            else res.json({"Error":false, "Message":"Success", "Users":rows});
        });
    });
    router.get("/users/:user_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user_login","user_id",req.params.user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
}

module.exports = REST_ROUTER;