var mysql   = require("mysql");
var bodyParser = require('body-parser');
var VerifyToken = require('../auth-controller/VerifyToken.js');

function BOOK_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

BOOK_ROUTER.prototype.handleRoutes= function(router,connection) {


    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
   
    router.post("/insertBook", VerifyToken, function(req, res) {
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user_login","user_email","user_password",req.body.email,hashedpassword];//req.userId
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            }
            else{
            res.json({"Error" : false, "Message" : "book successfully added up"});}
        });
    });
}

module.exports = BOOK_ROUTER;