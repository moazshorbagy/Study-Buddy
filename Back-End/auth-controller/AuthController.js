var mysql = require("mysql");
var bcrypt = require("bcryptjs");
var config = require("../config");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var VerifyToken = require("./VerifyToken.js");
var sendEmail = require("../email/SendEmail");

function AUTH_ROUTER(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

AUTH_ROUTER.prototype.handleRoutes = function(router, connection) {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post("/register", function(req, res) {
    var salt = bcrypt.genSaltSync(10);
    var hashedpassword = bcrypt.hashSync(req.body.password, salt);
    if (req.body.year == "Graduate") req.body.year = 0;

    var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";

    var table = [
      "user",
      "user_name",
      "user_email",
      "user_password",
      "user_phone",
      "user_department",
      "user_year",
      req.body.username,
      req.body.email,
      hashedpassword,
      req.body.phone,
      req.body.department,
      req.body.year
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        new sendEmail(req.body.email);
        res.json({ Error: false, Message: "successfully signed up" });
      }
    });
  });

  router.post("/login", function(req, res) {
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["user", "user_email", req.body.email];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err)
        return res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });

      if (rows == "")
        return res.json({
          Error: true,
          Message: "No user found",
          statusCode: "404"
        });
      else {
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          rows[0].user_password
        );
        if (!passwordIsValid)
          return res.json({
            Error: true,
            Message: "Incorrect password",
            statusCode: "401"
          });
        //Creating token
        var token = jwt.sign({ id: rows[0].user_id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.json({
          Error: false,
          Message: "Successfully logged in",
          token: token,
          id: rows[0].user_id,
          statusCode: "200"
        });
      }
    });
  });

  router.post("/userinfo", VerifyToken, function(req, res) {
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["user", "user_id", req.body.userId];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err)
        return res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"
        });

      if (rows == "")
        return res.json({
          Error: true,
          Message: "No user found",
          statusCode: "404"
        });
      else {
        return res.json({
          Error: false,
          Message: "Success",
          userInfo: rows[0]
        });
      }
    });
  });

  router.post("/changeinfo", VerifyToken, function(req, res) {
    var defaultQuery = "UPDATE ?? SET ??=? WHERE ??=?";
    var query = "";
    if (req.body.email != "") {
      var table = ["user", "user_email", req.body.email, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"
          });
      });
      console.log("email changed");
    }
    if (req.body.name != "") {
      var table = ["user", "user_name", req.body.name, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"
          });
      });
      console.log("name changed");
    }
    if (req.body.department != "") {
      var table = [
        "user",
        "user_department",
        req.body.department,
        "user_id",
        req.userId
      ];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"
          });
      });
      console.log("dep changed");
    }
    if (req.body.year != "") {
      console.log("arrive at year");
      var table = ["user", "user_year", req.body.year, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"
          });
      });
      console.log("year changed");
    }
    if (req.body.phone != "") {
      var table = ["user", "user_phone", req.body.phone, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"
          });
      });
    }
    if (req.body.password != "") {
      var salt = bcrypt.genSaltSync(10);
      var hashedpassword = bcrypt.hashSync(req.body.password, salt);
      console.log(hashedpassword);
      var table = [
        "user",
        "user_password",
        hashedpassword,
        "user_id",
        req.userId
      ];
      query = mysql.format(defaultQuery, table);
      console.log(query);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"
          });
      });
    }
    return res.json({
      Error: false,
      Message: "Success"
    });
  });

  router.get("/Users", VerifyToken, function(req, res) {
    var query = "SELECT user_id,user_name,user_rate FROM user";

    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        console.log(rows);
        res.json({ Error: false, Message: "success", users: rows });
      }
    });
  });
  router.post("/rating", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";

    var table = [
      "User_Rating",
      "user_id",
      "rating_user",
      "rating",
      req.body.id,
      req.userId,
      req.body.rating
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        return res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        var rating = 0.0;
        var query2 = "SELECT * FROM User_Rating WHERE user_id="+req.body.id;
      
        console.log(req.body.id);
        connection.query(query2, function(err, rows2) {
          if (err) {
            console.log(err);
            res.json({ Error: true, Message: "Error executing MySQL query" });
          } else {
            console.log(rows2);
            if (rows2.length != 0) {
              for (var i = 0; i < rows2.length; i++) {
                rating += rows2[i].rating;
              }
              rating /= rows2.length;
              console.log(rows2.length);
              console.log(rating);
            }
            
            var query3 = "UPDATE User SET user_rate= "+rating+" WHERE user_id= "+req.body.id;

            connection.query(query3, function(err, rows) {
              if (err) {
                console.log(err);
                res.json({
                  Error: true,
                  Message: "Error executing MySQL query"
                });
              }
            });
          }
        });
        res.json({ Error: false, Message: "successfully rated the user" });
      }
    });
  });

  router.get("/view_rating", VerifyToken, function(req, res) {
    var rating = 0.0;
    var query = "SELECT * FROM ?? WHERE ?=?";

    var table = ["User_Rating", "user_id", req.body.id];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        if (rows.Length != 0) {
          for (var i = 0; i < rows.Length; i++) {
            rating += rows[i].rating;
          }
          rating /= rows.Length;
        }
        res.json({ Error: false, Message: "success", Rating: rating });
      }
    });
  });

  router.get("/logout", function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });
};

module.exports = AUTH_ROUTER;
