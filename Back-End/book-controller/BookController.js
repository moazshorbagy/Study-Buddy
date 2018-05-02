var mysql = require("mysql");
var bodyParser = require("body-parser");
var VerifyToken = require("../auth-controller/VerifyToken.js");

function BOOK_ROUTER(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

BOOK_ROUTER.prototype.handleRoutes = function(router, connection) {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  //allows a user to insert a book
  //VerifyToken: verifies the token provided to allow the user to access private data
  router.post("/insertBook", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?)";
    var table = [
      "book",
      "book_status",
      "book_code",
      "book_author",
      "book_title",
      "book_edition",
      "book_duration",
      "donor_ID",
      "AVAILABLE",
      req.body.code,
      req.body.author,
      req.body.title,
      req.body.edition,
      req.body.duration,
      req.userId
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        res.json({ Error: false, Message: "book successfully added" });
      }
    });
  });

  //Allows a user to request a book
  router.post("/requestBook", VerifyToken, function(req, res) {
    var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    var table = [
      "Requested_Book",
      "user_id",
      "book_author",
      "book_title",
      "book_edition",
      req.userId,
      req.body.author,
      req.body.title,
      req.body.edition,
    ];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query" });
      } else {
        res.json({ Error: false, Message: "book successfully added" });
      }
    });
  });

 //Selects all the books in the database to be displayed
  router.get("/Book", VerifyToken, function(req, res) {
    var i, date, month, year;
    //Only the AVAILABLE books
    //Doesn't return the books posted by the accessing user as it's illogical to be displayed in the search
    var query = "SELECT * FROM book WHERE book_status = 'Available'"+" AND NOT donor_id="+req.userId;
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else {
        for(i = 0; i<rows.length; i++)
        {
          //converting the date to another format to be comparable
          date = new Date(rows[i].book_post_date).getUTCDate();
          month = new Date(rows[i].book_post_date).getUTCMonth()+1;
          year = new Date(rows[i].book_post_date).getUTCFullYear();
          rows[i].book_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Books: rows, n: rows.length, statusCode: "200" });
      }
    });
  });

  //allows the user to view the books he donated or the books he took from another user
  router.get("/myBooks", VerifyToken, function(req, res) {
    var i, date, month, year;
    var query = "SELECT * FROM book WHERE donor_id = "+req.userId+ " OR owner_id="+req.userId;
    connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else {
        //converting the date to another format to be comparable
        for(i = 0; i<rows.length; i++)
        {
          date = new Date(rows[i].book_post_date).getUTCDate();
          month = new Date(rows[i].book_post_date).getUTCMonth()+1;
          year = new Date(rows[i].book_post_date).getUTCFullYear();
          rows[i].book_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Books: rows, n: rows.length, statusCode: "200" });
      }
    });
  });

  //Allows a user to search for a certain book
  router.post("/searchBook", VerifyToken, function(req, res) {
    var title = req.body.title, author = req.body.author;
    //changing undefined to an empty string
    if(title=="") title = "";
    if(author=="") author = "";

    var query =
      "SELECT * FROM book WHERE" + " book_title LIKE '%" + title + "%'" + " AND book_code LIKE '%" + req.body.code + "%' " + " AND book_author LIKE '%" + author + "%' AND book_status = 'AVAILABLE' AND NOT donor_id="+req.userId;
      connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")//if rows are empty it means no books where found
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        //converting the date to another format to be comparable
        for(i = 0; i<rows.length; i++)
        {
          date = new Date(rows[i].book_post_date).getUTCDate();
          month = new Date(rows[i].book_post_date).getUTCMonth()+1;
          year = new Date(rows[i].book_post_date).getUTCFullYear();
          rows[i].book_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Books: rows, n: rows.length, statusCode: "200" });}
    });
  });

  //allows a user to search he participated in
  router.post("/searchMyBooks", VerifyToken, function(req, res) {
    var title = req.body.title, author = req.body.author;
    if(title=="") title = "";
    if(author=="") author = "";

    var query =
      "SELECT * FROM book WHERE" +" (donor_id="+req.userId+" OR owner_id="+req.userId+ ") AND book_title LIKE '%" + title + "%'" + " AND book_code LIKE '%" + req.body.code + "%' " + " AND book_author LIKE '%" + author+ "%'";
      console.log(query);
      connection.query(query, function(err, rows) {
      if (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error executing MySQL query", statusCode: "500" });
      } else if (rows == "")//if rows are empty it means no books where found
        res.json({ Error: true, Message: "No books found", statusCode: "404" });
      else {
        //converting the date to another format to be comparable
        for(i = 0; i<rows.length; i++)
        {
          date = new Date(rows[i].book_post_date).getUTCDate();
          month = new Date(rows[i].book_post_date).getUTCMonth()+1;
          year = new Date(rows[i].book_post_date).getUTCFullYear();
          rows[i].book_post_date = ""+year +"-"+ month +"-"+ date;
        }
        res.json({ Error: false, Books: rows, n: rows.length, statusCode: "200" });}
    });
  });
};

module.exports = BOOK_ROUTER;
