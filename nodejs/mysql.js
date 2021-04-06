var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "nodejs",
  password: "Keroro1!",
  database: "alimysqltutorials",
});
// console.log(connection);

connection.connect();
console.log(connection);
connection.query("SELECT * from topic", function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

connection.end();
