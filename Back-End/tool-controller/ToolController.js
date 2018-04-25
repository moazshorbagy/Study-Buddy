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

  router.post("/insertTool", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?)";
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

  router.get("/Tool", VerifyToken, function(req, res) {
    var i, date, month, year;
    var query = "SELECT * FROM Tool WHERE tool_status = 'AVAILABLE'";
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else {
        for(i = 0; i<rows.length; i++)
        {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth()+1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Tools: rows, n: rows.length, statusCode: "200" });
      }
    });
  });

  router.post("/searchTool", VerifyToken, function(req, res) {
    var type = req.body.type, manufacturer = req.body.manufacturer;
    if(type=="") type = "0xundx0";
    if(manufacturer=="") manufacturer = "0xundx0";

    var query =
      "SELECT * FROM Tool WHERE" + " type LIKE '%" + type + "%'" + " OR manufacturer LIKE '%" + manufacturer + "%'";
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")
        res.json({ Error: true, Message: "No tools found", statusCode: "404" });
      else {
        res.json({ Error: false, Tools: rows, n: rows.length, statusCode: "200" });}
    });
  });
};

module.exports = TOOL_ROUTER;
