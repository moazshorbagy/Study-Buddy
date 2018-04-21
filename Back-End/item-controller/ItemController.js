var mysql = require("mysql");
var sendEmail = require("../email/SendEmail");
var VerifyToken = require("../auth-controller/VerifyToken.js");
var bodyParser = require("body-parser");

function ITEM_ROUTER(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

ITEM_ROUTER.prototype.handleRoutes = function(router, connection) {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post("/getCart", VerifyToken, function(req, res) {
      var bookid=new Array();
    for(var i in req.body){
      console.log(req.body[i]["bookID"])
      bookid[i]=req.body[i]["bookID"];
    }
    console.log(bookid);
    
    for(i=0;i<bookid.length;i++){
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var table = [
        "book",
        "book_status",
        "PENDING",
        "book_id",
        bookid[i]
      ];
      query = mysql.format(query, table);
      console.log(query);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
         return  res.json({ Error: true, Message: "Error executing MySQL query" });
        }
      });
    
    }
    res.json({ Error: false, Message: "Status successfully changed" });
  });
};

module.exports = ITEM_ROUTER;
