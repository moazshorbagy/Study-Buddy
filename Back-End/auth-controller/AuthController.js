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
    if(req.body.year == "Graduate") req.body.year = 0;

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
        return res.json({Error: false, Message: "Success", userInfo: rows[0]});
      }
    });
  });

  router.get("/logout", function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });
};

module.exports = AUTH_ROUTER;
