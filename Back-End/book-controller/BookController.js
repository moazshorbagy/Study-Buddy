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
        var query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
        var table = ["book","book_title","book_author","book_code","book_edition","book_duration",req.body.title,req.body.author,req.body.code,req.body.edition,req.body.duration];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            }
            else{
            res.json({"Error" : false, "Message" : "book successfully added"});}
        });
    });
}

module.exports = BOOK_ROUTER;