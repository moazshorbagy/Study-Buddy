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
      if(req.body[i].type=="Book"){
      table = [
        "book",
        "book_status",
        "PENDING",
        "book_id",
        req.body[i]["bookID"]
      ];
    }
    else{
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

      query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
      if(req.body[i].type=="Book"){
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
    }
    else{
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
    }
    res.json({
      Error: false,
      Message: "Status successfully changed and request has been added"
    });
  });

  router.get("/getRequest", VerifyToken, function(req, res) {
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = [
      "Request",
      "donor_id",
      req.userId
    ];
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

  router.post("/getRequest_user", VerifyToken, function(req, res) {
    var query =
      "SELECT ??, ?? FROM ??, ?? WHERE ??=? AND ??=? ";
      if(req.body.type=="Book"){
      var table = [
        "user_name",
        "book_title",
        "User",
        "Book",
        "user_id",
        req.body.user_id,
        "book_id",
        req.body.item_id,
      ];
    }
    else{
      var table = [
        "user_name",
        "type",
        "User",
        "Tool",
        "user_id",
        req.body.user_id,
        "tool_id",
        req.body.item_id,
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
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
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

  router.post("/deleteRequest", VerifyToken, function(req, res) {
    if(req.body.type=="Book"){
    var query =
      "DELETE FROM request WHERE item_id = "+req.body.item_id + " AND type = 'Book'";
    }
    else{
    var query =
      "DELETE FROM request WHERE item_id = "+req.body.item_id + " AND type = 'Tool'";
    }


    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          statusCode: "200"
        });
      }
    });
  });

  router.post("/updateOwner", VerifyToken, function(req, res) {
    if(req.body.type=="Book"){
    var query =
      "UPDATE book SET owner_id = "+req.body.user_id+ ", book_status='UNAVAILABLE' " + " WHERE book_id = "+req.body.item_id
    }
    else{
      var query =
      "UPDATE tool SET owner_id = "+req.body.user_id+ ", tool_status='UNAVAILABLE' " + " WHERE tool_id = "+req.body.item_id
    }
  

    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          statusCode: "200"
        });
      }
    });
  });

  router.post("/revertStatus", VerifyToken, function(req, res) {
    if(req.body.type=="Book"){
    var query =
      "UPDATE book SET book_status = 'AVAILABLE' WHERE book_id = "+req.body.item_id;
    }
    else{
      var query =
      "UPDATE tool SET tool_status = 'AVAILABLE' WHERE tool_id = "+req.body.item_id;
    }

    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });
      } else if (rows == "")
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          statusCode: "200"
        });
      }
    });
  });

  router.get("/Tool", VerifyToken, function(req, res) {
    var i, date, month, year;
    var query = "SELECT * FROM Tool WHERE tool_status = 'AVAILABLE' AND NOT donor_id="+req.userId;
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

  router.get("/myTool", VerifyToken, function(req, res) {
    var i, date, month, year;
    var query = "SELECT * FROM Tool WHERE donor_id="+req.userId+" OR owner_id="+req.userId;
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

  router.post("/searchTool", VerifyToken, function(req, res) {
    var type = req.body.type, manufacturer = req.body.manufacturer;
    console.log(req.body);
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
        for(i = 0; i<rows.length; i++)
        {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth()+1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Tools: rows, n: rows.length, statusCode: "200" });}
    });
  });

  router.post("/searchMyTool", VerifyToken, function(req, res) {
    var type = req.body.type, manufacturer = req.body.manufacturer;
    console.log(req.body);
    if(type=="") type = "0xundx0";
    if(manufacturer=="") manufacturer = "0xundx0";

    var query =
      "SELECT * FROM Tool WHERE (donor_id="+req.userId +" OR owner_id="+ req.userId + ") AND type LIKE '%" + type + "%'" + " OR manufacturer LIKE '%" + manufacturer + "%'";
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")
        res.json({ Error: true, Message: "No tools found", statusCode: "404" });
      else {
        for(i = 0; i<rows.length; i++)
        {
          date = new Date(rows[i].tool_post_date).getUTCDate();
          month = new Date(rows[i].tool_post_date).getUTCMonth()+1;
          year = new Date(rows[i].tool_post_date).getUTCFullYear();
          rows[i].tool_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Tools: rows, n: rows.length, statusCode: "200" });}
    });
  });

  router.post("/requestTool", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
    var table = [
      "Requested_Item",
      "user_id",
      "type",
      "manufacturer",
      req.userId,
      req.body.type,
      req.body.manufacturer,
    ];
    query = mysql.format(query, table);
    console.log(query);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        res.json({ Error: false, Message: "book successfully added" });
      }
    });
  });

  

  


};
module.exports = ITEM_ROUTER;
