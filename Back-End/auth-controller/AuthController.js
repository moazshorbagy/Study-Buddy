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

  //Adds a new user to the database
  router.post("/register", function(req, res) {
    //hashing password
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
    //using format we can protect the database from SQL injection
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        //sends email to the provided address
        new sendEmail(req.body.email, "welcome");
        res.json({ Error: false, Message: "successfully signed up" });
      }
    });
  });

  //responsible for logging the user in
  router.post("/login", function(req, res) {
    //selecting the user by email to check if he's already registered or not
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["user", "user_email", req.body.email];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err)
        return res.json({
          Error: true,
          Message: "Error executing MySQL query",
          //statusCode 500 means internal server error
          statusCode: "500"
        });
      //if rows are empty it means he's not in the database
      if (rows == "")
        return res.json({
          Error: true,
          Message: "No user found",
          statusCode: "404"
        });
      else {
        //else he exists so we check on his password by comparing the hashed passwords
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          rows[0].user_password
        );
        if (!passwordIsValid)
          //if compareSync returns zero it means that the passwords doesn't match
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
          //sending the token to allow the user to access private data
          token: token,
          id: rows[0].user_id,
          statusCode: "200"
        });
      }
    });
  });

  //This function returns info about the user
  //using the VerifyToken in the parameter list we can validate the token provided
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
        //checks to see if the ID provided exists, if rows is empty it means it's not in the database
        return res.json({
          Error: true,
          Message: "No user found",
          statusCode: "404"
        });
      else {
        return res.json({
          Error: false,
          Message: "Success",
          //returns the info about the user
          userInfo: rows[0]
        });
      }
    });
  });

  //search for specific user his user name
  router.post("/searchUser", VerifyToken, function(req, res) {
    var Name = req.body.name;
    //if the name is not sent (undefined) we should convert it to string
    if (Name == "") Name = "";
    var query =
      "SELECT user_name, user_rate FROM User WHERE ?? LIKE '%" +
      Name +
      "%' AND NOT user_id = ?";
      var table = [
        "user_name",
        req.userId        
      ];
    query = mysql.format(query, table);  
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error executing MySQL query",
          statusCode: "500"//internal server error
        });
        //if rows are empty it means it wasn't found in the database
      } else if (rows == "")
        res.json({ Error: true, Message: "No users found", statusCode: "404" });
      else {
        res.json({
          Error: false,
          //returns all users with names like the one provided
          Users: rows,
          n: rows.length,
          statusCode: "200"//statusCode 200 means success
        });
      }
    });
  });

  //Allows a user to change his account information
  router.post("/changeinfo", VerifyToken, function(req, res) {
    var defaultQuery = "UPDATE ?? SET ??=? WHERE ??=?";
    var query = "";
    //if there's an email provided execute this query
    if (req.body.email != "") {
      var table = ["user", "user_email", req.body.email, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"//internal server error
          });
      });
    }
    //if a user name is provided execute this query
    if (req.body.name != "") {
      var table = ["user", "user_name", req.body.name, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"//internal server error
          });
      });
    }
    //if there's a department provided execute this query
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
            statusCode: "500"//internal server error
          });
      });
    }
    //if there's a year provided execute this query
    if (req.body.year != "") {
      var table = ["user", "user_year", req.body.year, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500" //internal server error
          });
      });
    }
    //if there's phone number provided execute this query
    if (req.body.phone != "") {
      var table = ["user", "user_phone", req.body.phone, "user_id", req.userId];
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"//internal server error
          });
      });
    }
    //if a password is provided execute this query
    if (req.body.password != "") {
      //first of all we need to hash this password
      var salt = bcrypt.genSaltSync(10);
      var hashedpassword = bcrypt.hashSync(req.body.password, salt);
      var table = [
        "user",
        "user_password",
        hashedpassword,
        "user_id",
        req.userId
      ];
      //execute the query with the hashed password
      query = mysql.format(defaultQuery, table);
      connection.query(query, function(err, rows) {
        if (err)
          return res.json({
            Error: true,
            Message: "Error executing MySQL query",
            statusCode: "500"//internal server error
          });
      });
    }
    return res.json({
      Error: false,
      Message: "Success"
    });
  });

  //return all the users registered
  router.get("/Users", VerifyToken, function(req, res) {
    //for privacy purposes we only provide the user rating
    var query = "SELECT user_id,user_name,user_rate FROM user WHERE NOT user_id ="+req.userId;

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

  //This function helps the user to rate another user
  router.post("/rating", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
    //insert the rating of the user to the other user
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
        return res.json({
          Error: true,
          Message: "Error executing MySQL query"
        });
      } else {
        //here we calculate the average of the user rating to be updated
        var rating = 0.0;
        var query2 = "SELECT * FROM User_Rating WHERE user_id=" + req.body.id;

        connection.query(query2, function(err, rows2) {
          if (err) {
            console.log(err);
            res.json({ Error: true, Message: "Error executing MySQL query" });
          } else {
            if (rows2.length != 0) {
              for (var i = 0; i < rows2.length; i++) {
                rating += rows2[i].rating;
              }
              rating /= rows2.length;
            }
            //Update the user rating from the calculate average
            var query3 =
              "UPDATE User SET user_rate= " +
              rating +
              " WHERE user_id= " +
              req.body.id;

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

  //views the user rating of a provided User ID
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
        //loop to get the average rating
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
  //Logging out only checks if the token exists and return error if no token provided
  router.get("/logout", VerifyToken, function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });
};

module.exports = AUTH_ROUTER;
