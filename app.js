/**
 * Module dependencies.
 */
//var helmet 	= 	require('helmet'); //to protect against attacks
var express = 	require('express');
var hbs 	= 	require('express-hbs');
var mysql 	= 	require('mysql')
var favicon = 	require('serve-favicon');

var bParser = 	require("body-parser");
var hash 	= 	require('pass').hash;
var session = 	require('express-session');

var app 	= 	express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'recit',
  password : 'recitations',
  database : 'dd1368'
});
connection.connect();

// config
app.set('view engine', 'hbs')
//app.use(helmet());
app.use(express.static(__dirname+'/public'));
app.use(favicon(__dirname + '/public/favicon.png'));

// login middleware
app.use(bParser.urlencoded({ extended: false }));
app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: 'x_SW%NY3}.XQJnUE>sn7[*8SDP4]'
}));


app.get('/', requireLogin, function (req, res) {
	res.render('index', {name: req.session.name})
});

app.post('/', requireLogin, function (req, res) {
	res.redirect('/recitation');
})

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
			ret += start + numerical[rows[i].question - 1]+ mid + alf[j] + "\">" + alf[j] + end;
			}
			ret += "</div> </div>";
		}
		res.render('quest', {num:req.body.rec, letter:req.body.group, question:ret});
	})
})

app.post('/quest', function(req, res) {
	if(req.body.number == 1) {
		connection.query("INSERT INTO r_1 (user_id, grp, 1_1, 1_2, 1_3, 2_1, 3_1, 3_2) VALUES (?,?,?,?,?,?,?,?);", 
			[req.session.user, req.body.grp, req.body.first[0], req.body.first[1], req.body.first[2], req.body.second[0], req.body.third[0], req.body.third[1]], 
			function(err, rows, fields) {
				if(err) throw err;
			});
	} else if(req.body.number == 2) {
		connection.query("INSERT INTO r_2 (user_id, grp, 1_1, 1_2, 2_1, 2_2) VALUES (?,?,?,?,?,?);", 
			[req.session.user, req.body.grp, req.body.first[0], req.body.first[1], req.body.second[0], req.body.second[1]], 
			function(err, rows, fields) {
				if(err) throw err;
			});
	} else {
		connection.query("INSERT INTO r_3 (user_id, grp, 1_1, 1_2, 2_1, 3_1, 3_2) VALUES (?,?,?,?,?,?,?);", 
			[req.session.user, req.body.grp, req.body.first[0], req.body.first[1], req.body.second[0], req.body.third[0], req.body.third[1]],
			function(err, rows, fields) {
				if(err) throw err;
			});		
	}
	res.redirect('/');
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
			req.session.user = req.body.kth_id;
			req.session.name = req.body.f_name;
			//req.session.user = rows[0];
			//delete req.session.user.pwd;
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