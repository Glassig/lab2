var express = require('express')
var mysql = require('mysql')
var favicon = require('serve-favicon');
var app = express()

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'recit',
  password : 'recitations',
  database : 'dd1368'
});
require(__dirname + '/public/login.js')(connection);

connection.connect();

app.set('view engine', 'hbs')
app.use(express.static(__dirname+'/public'));
app.use(favicon(__dirname + '/public/favicon.png'));
 
app.get('/', function (req, res) {
	connection.query('SELECT * from users', function(err, rows, fields) {
		if (err) throw err;
		var output = '';
 		console.log('The solution is: ', rows);
 		for (var i = 0; i < rows.length; i++) {
  			//console.log(rows[i].name);
  			output += '<li>' + rows[i].id + '</li>';
		};
 		res.render('index', {resitations: output})
	});
})

app.get('/login', function(req, res) {
	res.render('login');
})

app.post('/user', function (req, res) {

})

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});