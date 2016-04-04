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
	res.render('recitation');
});

app.post('/recitation', function(req, res) {
	connection.query("SELECT * FROM requir WHERE rec = ?;", [req.body.rec], function(err, rows, fields) {
		if(err) throw err;
		var alf = ["a", "b", "c", "d", "e", "f"];
		var numerical = ["first", "second", "third"];
		var start = "<input type=\"checkbox\" name=\"";
		var mid ="\" value=\"";
		var end = "</input> </br>";
		var ret = "";
		for(var i = 0; i < rows.length; i++) {
			ret += "<div id=\"Q" +  rows[i].question + "\"> <label for=\"" + rows[i].question + "\">" + rows[i].question + ": </label></br> <div id=\"boxes\">";
			for(var j = 0; j < rows[i].avail_nr; j++) {
			ret += start + numerical[rows[i].question]+ mid + alf[j] + "\">" + alf[j] + end;
			}
			ret += "</div> </div>";
		}
		res.render('quest', {num:req.body.rec, letter:req.body.group, question:ret});
	})
})

app.post('/quest', function(req, res) {
	if(req.body.number == 1) {
		connection.query("INSERT INTO rec_1 (user_id, grp, 1_1, 1_2, 1_3, 2_1, 3_1, 3_2) VALUES (?,?,?,?,?,?,?,?);", 
			[user.kth_id, req.body.grp, req.body.first[0], req.body.first[1], req.body.first[2], req.body.second[0], req.body.third[0], req.body.third[1]], 
			function(err, rows, fields) {
				if(err) throw err;
			});
	} else if(req.body.number == 2) {
		connection.query("INSERT INTO rec_2 (user_id, grp, 1_1, 1_2, 2_1, 2_2) VALUES (?,?,?,?,?,?);", 
			[user.kth_id, req.body.grp, req.body.first[0], req.body.first[1], req.body.second[0], req.body.second[1]], 
			
			function(err, rows, fields) {
				if(err) throw err;
				console.log(user.kth_id);
				console.log(req.body.grp);
				console.log(req.body.first[0]);
				console.log(req.body.first[1]);
				console.log(req.body.second[0]);
				console.log(req.body.second[1]);
			});

	} else {
		connection.query("INSERT INTO rec_3 (user_id, grp, 1_1, 1_2, 2_1, 3_1, 3_2) VALUES (?,?,?,?,?,?,?);", 
			[user.kth_id, req.body.grp, req.body.first[0], req.body.first[1], req.body.second[0], req.body.third[0], req.body.third[1]],
			function(err, rows, fields) {
				if(err) throw err;
			});		
	}
	res.redirect('index');
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