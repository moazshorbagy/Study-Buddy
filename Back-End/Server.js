var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var auth = require("./auth-controller/AuthController.js")
var book = require("./book-controller/BookController.js")
var item = require("./item-controller/ItemController.js")
var app  = express();

function REST(){
    var self = this;
    self.connectMysql();
};

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'da3m0ns',
        database : 'studybuddy',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var authRouterObj = express.Router();
      var bookRouterObj = express.Router();
      var itemRouterObj = express.Router();
      app.use('/api', authRouterObj);
      app.use('/api', bookRouterObj);
      app.use('/api', itemRouterObj);
      var authRouter = new auth(authRouterObj,connection);
      var bookRouter = new book(bookRouterObj,connection);
      var itemRouter = new item(itemRouterObj,connection);
      
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL -" + err);
    process.exit(1);
}

new REST();