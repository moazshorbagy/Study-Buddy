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

      query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
      table = [
        "Request",
        "book_id",
        "donor_id",
        "user_id",
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
    res.json({
      Error: false,
      Message: "Status successfully changed and request has been added"
    });
  });
};
module.exports = ITEM_ROUTER;