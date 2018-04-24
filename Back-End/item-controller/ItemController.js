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
    var i, query, table;
    for (var i in req.body) {
      query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      table = [
        "book",
        "book_status",
        "PENDING",
        "book_id",
        req.body[i]["bookID"]
      ];
      query = mysql.format(query, table);
      console.log(query);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          return res.json({
            Error: true,
            Message: "Error executing MySQL query"
          });
        }
      });
    }
  });
  
      router.post("/insertRequest", VerifyToken, function(req, res) {
        for(var i in req.body){
      query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
      table = [
        "Request",
        "BookID",
        "DonorID",
        "UserID",
        req.body[i]["bookID"],
        req.body[i]["donorID"],
        req.userId
      ];
      query = mysql.format(query, table);
      console.log(query);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          return res.json({
            Error: true,
            Message: "Error executing MySQL query"
          });
        }
      });
    }
    });
    
    

  router.get("/getRequest", VerifyToken, function(req, res) {
    var query = "SELECT * FROM request WHERE DonorID = "+ req.userId;
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else {
        res.json({ Error: false, Requests: rows, n: rows.length, statusCode: "200" });
      }
    });
  });

  router.post("/getRequest_user", VerifyToken, function(req, res) {
    var query = "SELECT user_name,book_title FROM user,book WHERE user_id = "+ req.body.UserID + " AND book_id= "+req.body.BookID
     connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        res.json({ Error: false, Book: rows, n: rows.length, statusCode: "200" });}
    });
  });

  router.post("/getRequest_book", VerifyToken, function(req, res) {
    var query = "SELECT * FROM book WHERE book_id = "+ req.body.BookID;
     connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        res.json({ Error: false, Book: rows, n: rows.length, statusCode: "200" });}
    });
  });



};
module.exports = ITEM_ROUTER;