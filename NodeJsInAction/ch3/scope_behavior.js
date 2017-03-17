function asyncFunction(callback) {
  setTimeout(function () {
    callback()
  }, 200);
}


/*
var color = 'blue';

asyncFunction(function () {
  console.log('The color is ' + color);
});

color = 'green';

*/



var color = 'blue';
//preserve_global_with_closure
//用匿名函数保留全局变量的值   利用闭包控制程序的状态
(function(color) {
  asyncFunction(function() {
    console.log('The color is ' + color);
  })
})(color);

color = 'green';