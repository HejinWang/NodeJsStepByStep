var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mydatabase', server, { w: 1 });

client.open(function (err) {
  if (err) throw err;
  client.collection('test_insert', function (err, collection) {
    if (err) throw err;

    collection.find({ "title": "I like cake" }).toArray(
      function (err, results) {
        if (err) throw err;
        console.log(results);
      });
    //更新操作
    //var _id = new client.bson_serializer.ObjectID('4e650d344ac74b5a01000001');
    var _id = new ObjectID('58ea3f02ce43083004adc324');
    collection.update(
      { _id: _id },
      { $set: { "title": "I ate too much cake" } },
      { safe: true },
      function (err) {
        if (err) throw err;
      }
    );

    collection.remove({ _id: _id }, { safe: true }, function (err) {
      if (err) throw err;
    });

  });
});
