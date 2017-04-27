var http = require("http"),
    fs = require("fs"),
    colors = require('./colors.js'),
    path = require('path'),
    root = __dirname;

var server = http.createServer(function (req, res) { }).listen(8001);
console.log("http start 8001");

var imgPath = path.join(__dirname, 'img/');

//便利数组
colors.map(function (color, i) {
    //  if (i > 1) return;
    var imgUrl = 'http://zhongguose.com/img/name/' + color.pinyin + '.png';

    var imgDirpath = imgPath + color.pinyin + '.png';

    (function (imgUrl, imgDirpath) {
        fs.exists(imgDirpath, function (exists) {

            if (!exists) {
                // console.log(imgurl);
                // console.log(imgdirpath);
                http.get(imgUrl, function (res) {
                    var picName = res.req.path.substring(res.req.path.lastIndexOf('/') + 1);
                    //判断文件是否存在

                    var imgData = "";
                    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开 
                    res.on("data", function (chunk) {
                        imgData += chunk;
                    });
                    res.on("end", function () {
                        fs.writeFile(imgDirpath, imgData, "binary", function (err) {
                            if (err) {
                                console.log("down fail");
                            }
                            console.log("down success");
                        });
                    });
                });
            }
        });
    })(imgUrl, imgDirpath);
});