var fs = require('fs');
/*
fs.readFile('./resource.json', function (er, data) {
    console.log(data);
})
*/
var steam = fs.createReadStream('./resource.json');
steam.on('data', function (chunk) {
    console.log(chunk);
});
steam.on('end', function (chunk) {
    console.log('finished');
});