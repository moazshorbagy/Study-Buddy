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

  //This is responsible for obtaining book/tool logic
  //VerifyToken: verifies the token provided to allow the user to access private data
  router.post("/getCart", VerifyToken, function(req, res) {
    var i, query, table;
    //first of all change the status of item to PENDING
    for (var i in req.body) {
      query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      if (req.body[i].type == "Book") {
        table = [
          "book",
          "book_status",
          "PENDING",
          "book_id",
          req.body[i]["bookID"]
        ];
      } else {
        table = [
          "tool",
          "tool_status",
          "PENDING",
          "tool_id",
          req.body[i]["toolID"]
        ];
      }
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
      /*var optionalObj;
      optionalObj.myName = req.body[i]["donorName"];
      optionalObj.hisName = req.body[i]["receiverName"];
      optionalObj.hisName = req.body[i]["receiverEmail"];
      optionalObj.itemName = req.body[i]["itemName"];*/

      //Then we insert this request of an item to the request table in the DB
      query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
      if (req.body[i].type == "Book") {
        table = [
          "Request",
          "type",
          "item_id",
          "donor_id",
          "user_id",
          req.body[i]["type"],
          req.body[i]["bookID"],
          req.body[i]["donorID"],
          req.userId
        ];
        //optionalObj.type = "Book";
      } else {
        table = [
          "Request",
          "type",
          "item_id",
          "donor_id",
          "user_id",
          req.body[i]["type"],
          req.body[i]["toolID"],
          req.body[i]["donorID"],
          req.userId
        ];
        //optionalObj.type = "Tool";
      }
      //new sendEmail(req.body[i]["donorEmail"], "request", optionalObj);
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

  //Returns the requests on the user's donated items
  router.get("/getRequest", VerifyToken, function(req, res) {
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Request", "donor_id", req.userId];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else {
        res.json({
          Error: false,
          Requests: rows,
          n: rows.length,
          statusCode: "200"
        });
      }
    });
  });

  //returns the user name and title/type of a specific request according to a provided user id and item id
  router.post("/getRequest_user", VerifyToken, function(req, res) {
    var query = "SELECT ??, ?? FROM ??, ?? WHERE ??=? AND ??=? ";
    if (req.body.type == "Book") {
      var table = [
        "user_name",
        "book_title",
        "User",
        "Book",
        "user_id",
        req.body.user_id,
        "book_id",
        req.body.item_id
      ];
    } else {
      var table = [
        "user_name",
        "type",
        "User",
        "Tool",
        "user_id",
        req.body.user_id,
        "tool_id",
        req.body.item_id
      ];
    }
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")//empty rows means no items found in the database matching the provided data
        res.json({ Error: true, Message: "No items found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          Book: rows,
          n: rows.length,
          statusCode: "200"
        });
      }
    });
  });

  //removes a request from the request table when the donor rejects the request
  router.post("/deleteRequest", VerifyToken, function(req, res) {
    if (req.body.type == "Book") {
      var query =
        "DELETE FROM request WHERE item_id = " +
        req.body.item_id +
        " AND type = 'Book'";
    } else {
      var query =
        "DELETE FROM request WHERE item_id = " +
        req.body.item_id +
        " AND type = 'Tool'";
    }

    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")//empty rows means no items found in the database matching the provided data
        res.json({ Error: true, Message: "No items found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          statusCode: "200"
        });
      }
    });
  });

  //When a request has been accepted we update the owner of the item
  router.post("/updateOwner", VerifyToken, function(req, res) {
    if (req.body.type == "Book") {
      var query =
        "UPDATE book SET owner_id = " +
        req.body.user_id +
        ", book_status='UNAVAILABLE' " +
        " WHERE book_id = " +
        req.body.item_id;
    } else {
      var query =
        "UPDATE tool SET owner_id = " +
        req.body.user_id +
        ", tool_status='UNAVAILABLE' " +
        " WHERE tool_id = " +
        req.body.item_id;
    }

    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")//empty rows means no items found in the database matching the provided data
        res.json({ Error: true, Message: "No items found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          statusCode: "200"
        });
      }
    });
  });

  //This updates the status of an item when the donor rejects the request
  router.post("/revertStatus", VerifyToken, function(req, res) {
    if (req.body.type == "Book") {
      var query =
        "UPDATE book SET book_status = 'AVAILABLE' WHERE book_id = " +
        req.body.item_id;
    } else {
      var query =
        "UPDATE tool SET tool_status = 'AVAILABLE' WHERE tool_id = " +
        req.body.item_id;
    }

    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")//empty rows means no items found in the database matching the provided data
        res.json({ Error: true, Message: "No items found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          statusCode: "200"
        });
      }
    });
  });
};
module.exports = ITEM_ROUTER;