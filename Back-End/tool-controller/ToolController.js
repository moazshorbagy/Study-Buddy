var mysql = require("mysql");
var bodyParser = require("body-parser");
var VerifyToken = require("../auth-controller/VerifyToken.js");

function TOOL_ROUTER(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

TOOL_ROUTER.prototype.handleRoutes = function(router, connection) {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  //View all the tools posted
  router.get("/Tool", VerifyToken, function(req, res) {
    var i, date, month, year;
    //Selects only the tools available
    var query =
      "SELECT * FROM Tool WHERE tool_status = 'AVAILABLE' AND NOT donor_id=" +
      req.userId;
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else {
        //converting the date to another format to be comparable
        for (i = 0; i < rows.length; i++) {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth() + 1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = "" + year + "-" + month + "-" + date;
        }
        res.json({
          Error: false,
          Tools: rows,
          n: rows.length,
          statusCode: "200"
        });
      }
    });
  });

  //Allows the user to view the tools he participated in (Donated or Took from another user)
  router.get("/myTool", VerifyToken, function(req, res) {
    var i, date, month, year;
    var query =
      "SELECT * FROM Tool WHERE donor_id=" +
      req.userId +
      " OR owner_id=" +
      req.userId;
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else {
        //converting the date to another format to be comparable
        for (i = 0; i < rows.length; i++) {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth() + 1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = "" + year + "-" + month + "-" + date;
        }
        res.json({
          Error: false,
          Tools: rows,
          n: rows.length,
          statusCode: "200"
        });
      }
    });
  });

  //Allows a user to insert a tool in the database
  router.post("/insertTool", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
    var table = [
      "tool",
      "tool_status",
      "type",
      "manufacturer",
      "tool_duration",
      "donor_id",
      "AVAILABLE",
      req.body.type,
      req.body.manufacturer,
      req.body.duration,
      req.userId
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        res.json({ Error: false, Message: "tool successfully added" });
      }
    });
  });

  //Allows a user to search for a tool
  router.post("/searchTool", VerifyToken, function(req, res) {
    var type = req.body.type,
      manufacturer = req.body.manufacturer;
    console.log(req.body);
    //Converting undefined to empty string if it wasn't provided
    if (type == "") type = "";
    if (manufacturer == "") manufacturer = "";

    var query =
      "SELECT * FROM Tool WHERE" +
      " type LIKE '%" +
      type +
      "%'" +
      " AND manufacturer LIKE '%" +
      manufacturer +
      "%' AND NOT donor_id=" +
      req.userId;
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")
        //Rows are empty it means nothing was found in the database matching the provided info
        res.json({ Error: true, Message: "No tools found", statusCode: "404" });
      else {
        //converting the date to another format to be comparable
        for (i = 0; i < rows.length; i++) {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth() + 1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = "" + year + "-" + month + "-" + date;
        }
        res.json({
          Error: false,
          Tools: rows,
          n: rows.length,
          statusCode: "200"
        });
      }
    });
  });

  router.post("/searchMyTool", VerifyToken, function(req, res) {
    var type = req.body.type,
      manufacturer = req.body.manufacturer;
    //Converting undefined to empty string if it wasn't provided
    if (type == "") type = "";
    if (manufacturer == "") manufacturer = "";

    var query =
      "SELECT * FROM Tool WHERE (donor_id=" +
      req.userId +
      " OR owner_id=" +
      req.userId +
      ") AND type LIKE '%" +
      type +
      "%'" +
      " AND manufacturer LIKE '%" +
      manufacturer +
      "%'";
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")
        //Empty rows means the user had no participation
        res.json({ Error: true, Message: "No tools found", statusCode: "404" });
      else {
        //converting the date to another format to be comparable
        for (i = 0; i < rows.length; i++) {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth() + 1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = "" + year + "-" + month + "-" + date;
        }
        res.json({
          Error: false,
          Tools: rows,
          n: rows.length,
          statusCode: "200"
        });
      }
    });
  });

  //Allows a user to post a request for a specific tool
  router.post("/requestTool", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
    var table = [
      "Requested_Item",
      "user_id",
      "type",
      "manufacturer",
      req.userId,
      req.body.type,
      req.body.manufacturer
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        res.json({ Error: false, Message: "Tool successfully added" });
      }
    });
  });
};

module.exports = TOOL_ROUTER;
