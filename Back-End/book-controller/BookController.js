var mysql = require("mysql");
var bodyParser = require("body-parser");
var VerifyToken = require("../auth-controller/VerifyToken.js");

function BOOK_ROUTER(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

BOOK_ROUTER.prototype.handleRoutes = function(router, connection) {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post("/insertBook", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?)";
    var table = [
      "book",
      "book_status",
      "book_code",
      "book_author",
      "book_title",
      "book_edition",
      "book_duration",
      "doner_ID",
      "AVAILABLE",
      req.body.code,
      req.body.author,
      req.body.title,
      req.body.edition,
      req.body.duration,
      req.userId
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        res.json({ Error: false, Message: "book successfully added" });
      }
    });
  });

  router.get("/Book", VerifyToken, function(req, res) {
    var query = "SELECT * FROM book";
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else {
        res.json({ Error: false, Books: rows, n: rows.length, statusCode: "200" });
      }
    });
  });

  router.post("/searchBook", VerifyToken, function(req, res) {
    var query =
      "SELECT * FROM book WHERE" + " book_title LIKE '%" + req.body.title + "%'" + " OR book_code LIKE '%" + req.body.code + "%' " + " OR book_author LIKE '%" + req.body.author + "%'";
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        res.json({ Error: false, Books: rows, n: rows.length, statusCode: "200" });}
    });
  });
};

module.exports = BOOK_ROUTER;
