var mysql = require("mysql");
var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "nodejs",
  password: "Keroro1!",
  database: "alimysqltutorials",
});
db.connect();
module.exports = db;
