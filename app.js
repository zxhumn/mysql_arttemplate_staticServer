let http = require("http");
let fs = require("fs");
let path = require("path");
// 导入mime
let mime = require("mime");
// 引入模板引擎
let template = require("art-template");
// mysql
let mysql = require("mysql");

// 使用querystring进行转码
let qs = require('querystring');

// 网站根目录的 绝对路径
let rootPath = path.join(__dirname, "www");

// 开启服务
http
  .createServer((request, response) => {
    // 过来 就生成首页

    // 如果要的是首页 就返回 下面的内容
    let filePath = path.join(rootPath, qs.unescape(request.url));
    console.log(filePath);
    // 反之 读取文件 并返回
    if (filePath.indexOf("index.html") != -1) {
      // 从数据库获取数据
      var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "test"
      });

      connection.connect();

      connection.query("select * from manyhero", (error, results, fields) => {
        if (error) throw error;
        //  console.log(results);
        // 把数据通过模板引擎进行渲染
        var html = template(__dirname + "/www/index.html", {
          results
        });
        // console.log(html);

        // 返回渲染完毕的结果
        response.end(html);
      });

      connection.end();
    }
    // 如果不是首页 就读取并返回文件即可
    else {
      // 来什么 读什么
      fs.readFile(filePath, (err, data) => {
        console.log(filePath, "读取文件完毕 返回");
        // 自行判断 后缀名(.js .css .html .jpg .png .gif .ico)
        // mime类型
        // if else if else
        // 查找是否有人实现了 类似的功能
        response.writeHead(200, {
          "content-type": mime.getType(filePath)
        });

        if (err) {
          console.log(err);
        } else {
          response.end(data);
        }
      });
    }

    // 根据数据 生成对应的页面结构 li标签
    // 响应内容
    // response.end('you come');
  })
  .listen(80, "127.0.0.1", () => {
    console.log("listen to 127.0.0.1:80 success");
  });
