var fs = require("fs");
var path = "./data";
fs.readdir(path, (err, file) => {
  console.log(file);
});
