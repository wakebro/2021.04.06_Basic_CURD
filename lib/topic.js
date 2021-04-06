var url = require("url");
var db = require("./db");
var template = require("./template");
var qs = require("querystring");
exports.home = function (request, response) {
  db.query(`SELECT * from topic`, (error, topics) => {
    var title = "Welcom";
    var data = "Welcome, Node JS!";
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${data}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * from topic`, (error, topics) => {
    if (error) throw error;
    db.query(
      `select * from topic left join author on topic.author_id=author.id where topic.id=?`,
      [queryData.id],
      (error2, topic) => {
        if (error2) throw error2;
        var title = topic[0].title;
        var data = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${data}
              <p>by ${topic[0].name}</p>`,
          `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="/delete_process" method="POST" onsubmit="test">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query(`SELECT * from topic`, (error, topics) => {
    db.query(`select * from author`, (error, authors) => {
      var title = "Create";
      var list = template.list(topics);
      var html = template.HTML(
        title,
        list,
        `<form action="/create_process" method="POST">
              <p><input type="text" name="title" placeholder="Title"></p>
              <p><textarea name="description" placeholder="Description"></textarea></p>
              <p>
                ${template.authorSelect(authors)}
              </p> 
              <p><input type="submit"></p>
            </form>`,
        `<a href="/create">create</a>`
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
      `insert into topic (title, description, created, author_id) values(?,?,now(),?)`,
      [post.title, post.description, post.author],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
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
            `<form action="/update_process" method="POST">
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

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    var post = qs.parse(body);
    db.query(
      `update topic set title=?,description=?,author_id=? where id=?`,
      [post.title, post.description, post.author, post.id],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${post.id}` });
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
    db.query(`delete from topic where id=?`, [post.id], (error, result) => {
      if (error) throw error;
      response.writeHead(302, { Location: `/` });
      response.end();
    });
  });
};
