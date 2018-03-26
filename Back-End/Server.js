var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var rest = require("./REST.js");
var auth = require("./auth-controller/AuthController.js")
var book = require("./book-controller/BookController.js")
var app  = express();

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'da3m0ns',
        database : 'restful_api_demo',
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
      var restRouterObj = express.Router();
      var authRouterObj = express.Router();
      var bookRouterObj = express.Router();
      app.use('/api', restRouterObj);
      app.use('/api', authRouterObj);
      app.use('/api', bookRouterObj);
      var restRouter = new rest(restRouterObj,connection);
      var authRouter = new auth(authRouterObj,connection);
      var bookRouter = new book(bookRouterObj,connection);
      
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();