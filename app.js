var express = require('express')
var mysql = require('mysql')
var app = express()

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'recit',
  password : 'recitations',
  database : 'dd1368'
});

connection.connect();

app.set('view engine', 'hbs')
 
app.get('/', function (req, res) {
	connection.query('SHOW TABLES', function(err, rows, fields) {
		if (err) throw err;
 		console.log('The solution is: ', rows);
 		res.render('index', {resitations: rows})
	});
})

app.post('/user', function (req, res) {

})

console.log("Running on port 3000") 
app.listen(3000)
