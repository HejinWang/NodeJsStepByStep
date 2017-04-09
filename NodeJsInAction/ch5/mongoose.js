var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/tasks');

var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model('Task', Tasks);

var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function (err) {
  if (err) throw err;
  console.log('Task saved.');
});

var Task = mongoose.model('Task');
Task.find({ 'project': 'Bikeshed' }, function (err, tasks) {
  for (var i = 0; i < tasks.length; i++) {
    console.log('ID:' + tasks[i]._id);
    console.log(tasks[i].description);
  }
});

var Task = mongoose.model('Task');
Task.update(
  { _id: '58ea44ba94e3d614388810ef' },　　//用内部ID更新 
  { description: 'Paint the bikeshed green.' },
  { multi: false },  //只更新一个文档  
  function (err, rows_updated) {
    if (err) throw err;
    console.log('Updated.');
  });

var Task = mongoose.model('Task');
Task.findById('58ea44ba94e3d614388810ef', function (err, task) {
  task.remove();
  console.log('remove.');
});
//58ea44ba94e3d614388810ef