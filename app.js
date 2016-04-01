var express = require('express');
var hbs = require('express-hbs');
var app = express();
var mysql = require('mysql')
var favicon = require('serve-favicon');
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var session = require('client-sessions');
var helmet = require('helmet'); //to protect against attacks

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'recit',
  password : 'recitations',
  database : 'dd1368'
});
connection.connect();

app.use(session({
  cookieName: 'session',
  secret: 'djrR%[{3k‰#ekFF@@€¢‰¶))§¶j*%DDD',
  duration: 5 * 60 * 1000,
  activeDuration: 1 * 60 * 1000,
}));

app.set('view engine', 'hbs')
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
app.use(express.static(__dirname+'/public'));
app.use(favicon(__dirname + '/public/favicon.png'));
 
hbs.registerHelper('times', function(ith, amount) {
	var start = "<input type=\"checkbox\" name=\"" + ith + "th\" value=\"";
	var end = "</input>";
	var ret = "";
	for(var i = 0; i < amount; i++) {
		ret += start + (i+1) + "\">" + alf.indexOf(i) + end;
	}
})
app.get('/', requireLogin, function (req, res) {
	res.render('index', {name: req.session.user.f_name})
});

app.get('/recitation', requireLogin, function (req, res) {
	res.render('recitation', {choose_group: true});
});

app.post('/recitation', function(req, res) {
	connection.query("SELECT * FROM requir WHERE rec = ?;", [req.body.rec], function(err, rows, fields) {
		if(err) throw err;
		var alf = ["a", "b", "c", "d", "e", "f"];
		var start = "<input type=\"checkbox\" name=\"";
		var mid ="th\" value=\"";
		var end = "</input> </br>";
		var ret = "";
		for(var i = 0; i < rows.length; i++) {
			for(var j = 0; j < rows[i].avail_nr; j++) {
			ret += start + rows[i].question + mid + alf.indexOf(j) + "\">" + alf.indexOf(j) + end;
			}
		}
		res.render('recitation', {choose_group:false, question:ret});
	})
})

app.get('/login', function(req, res) {
	res.render('login', {flashmsg:false});
});

app.post('/login', function(req, res) {
	connection.query("SELECT * FROM users WHERE id = ? AND pwd = ?;", 
			[req.body.kth_id, req.body.password], function(err, rows, fields) {
		if(err) throw err;
		if(rows.length < 1) {
			//not a valid user
			res.render('login', {flashmsg:true})
		} else {
			//valid user.
			console.log(req.body.kth_id);
			req.session.user = rows[0];
			delete req.session.user.pwd;
			res.redirect('/');
		}
	})	
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});

function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};


app.listen(3000, function () {
  console.log('Listening on port 3000!');
});