var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var auth = require("./auth-controller/AuthController.js");
var book = require("./book-controller/BookController.js");
var tool = require("./tool-controller/ToolController.js");
var item = require("./item-controller/ItemController.js");
var app = express();

function REST() {
  var self = this;
  self.connectMysql();
}

//to allow the server to have control over GET, POST, ...
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//connects to the MySQL server, the server should be running with proper internet connection
REST.prototype.connectMysql = function() {
  var self = this;
  var pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "undertaker12",
    database: "studybuddy",
    debug: false
  });
  pool.getConnection(function(err, connection) {
    if (err) {
      self.stop(err);
    } else {
      self.configureExpress(connection);
    }
  });
};

//configuting routes
REST.prototype.configureExpress = function(connection) {
  var self = this;
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  var authRouterObj = express.Router();
  var bookRouterObj = express.Router();
  var itemRouterObj = express.Router();
  var toolRouterObj = express.Router();
  //routers are set to /api
  app.use("/api", authRouterObj);
  app.use("/api", bookRouterObj);
  app.use("/api", itemRouterObj);
  app.use("/api", toolRouterObj);
  //connecting the router
  var authRouter = new auth(authRouterObj, connection);
  var bookRouter = new book(bookRouterObj, connection);
  var itemRouter = new item(itemRouterObj, connection);
  var toolRouter = new tool(toolRouterObj, connection);

  self.startServer();
};

REST.prototype.startServer = function() {
  app.listen(3000, function() {
    console.log("All right ! I am alive at Port 3000.");
  });
};

REST.prototype.stop = function(err) {
  console.log("ISSUE WITH MYSQL -" + err);
  process.exit(1);
};

//creates the server
new REST();