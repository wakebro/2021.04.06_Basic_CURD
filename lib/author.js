var url = require("url");
var db = require("./db");
var template = require("./template");
var qs = require("querystring");

exports.home = function (request, response) {
  db.query(`SELECT * from topic`, (error, topics) => {
    db.query(`select * from author`, (error2, authors) => {
      var title = "author";
      var list = template.list(topics);
      var html = template.HTML(
        title,
        list,
        `
          ${template.authorTable(authors)}
          <style>
            table{
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
          </style>
          <form action="/author/create_process" method="POST">
            <p><input type="text" name="author" placeholder="Name"></p>
            <p><textarea name="description" placeholder="Description"></textarea></p>
            <p><input type="submit" value="Create"></p>
          </form>`,
        ``
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    var post = qs.parse(body);
    db.query(
      `insert into author (name, profile) values(?,?)`,
      [post.author, post.description],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * from topic`, (error, topics) => {
    if (error) throw error;
    db.query(
      `select * from topic where id=?`,
      [queryData.id],
      (error2, topic) => {
        if (error2) throw error2;
        db.query(`select * from author`, (error, authors) => {
          var list = template.list(topics);
          var html = template.HTML(
            topic[0].title,
            list,
            `<form action="/author/update_process" method="POST">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="Title" value="${
                    topic[0].title
                  }"></p>
                  <p><textarea name="description" placeholder="Description">${
                    topic[0].description
                  }</textarea></p>
                  <P>
                    ${template.authorSelect(authors, topic[0].author_id)}
                  </P>
                  <p><input type="submit"></p>
                  </form>`,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

exports.update = function (request, response) {
  db.query(`SELECT * from topic`, (error, topics) => {
    db.query(`select * from author`, (error2, authors) => {
      var _url = request.url;
      var queryData = url.parse(_url, true).query;
      db.query(
        `select * from author where id=?`,
        [queryData.id],
        (error3, author) => {
          var title = "author";
          var list = template.list(topics);
          var html = template.HTML(
            title,
            list,
            `${template.authorTable(authors)}
            <style>
                table{border-collapse: collapse;}
                td{border:1px solid black;}
            </style>
            <form action="/author/update_process" method="POST">
              <input type="hidden" name="id" value="${queryData.id}">
              <p>
                <input type="text" name="name" value="${
                  author[0].name
                }" placeholder="Name">
              </p>
              <p><textarea name="profile" placeholder="Description">${
                author[0].profile
              }</textarea></p>
              <p><input type="submit" value="Update"></p>
            </form>`,
            ``
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
  });
};

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    var post = qs.parse(body);
    db.query(
      `update author set name=?,profile=? where id=?`,
      [post.name, post.profile, post.id],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.delete_process = function (request, response) {
  var body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    var post = qs.parse(body);
    db.query(`delete from author where id=?`, [post.id], (error, result) => {
      if (error) throw error;
      response.writeHead(302, { Location: `/author` });
      response.end();
    });
  });
};
