var http = require('http');
var pg = require('pg');
var conString = "tcp://postgres:@localhost:5432/anduril";
var client = new pg.Client(conString);
client.connect();

client.query(  'INSERT INTO users ' +  "(name) VALUES ('Mike')");

client.query(  "INSERT INTO users " +  "(name, age) VALUES ($1, $2)",  ['Mike', 39]);

client.query(  "INSERT INTO users " +  "(name, age) VALUES ($1, $2) " +  "RETURNING id",  ['Mike', 39],  
function(err, result) {    
    if (err) throw err;    
    console.log('Insert ID is ' + result.rows[0].id);  
});

var query = client.query("SELECT * FROM users WHERE age > $1",  [40]);
query.on('row', function(row) {  //处理返回的记录  
    console.log(row.name)
});
query.on('end', function() {  
    //查询完成后的处理  
    client.end();
});


/*
CREATE TABLE users(
   ID SERIAL PRIMARY KEY NOT NULL,  
    name varchar(100) NOT NULL,  
    age int  NULL
);  

 
Server Type: PostgreSQL
Connection Name: mac
Host Name/IP Address: localhost
Port: 5432
Default Database: postgres
User Name: postgres
Save Password: Yes 

 */