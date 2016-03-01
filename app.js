var express = require('express')
var app = express()

app.set('view engine', 'hbs')

var resitation_dummy_data = [
	{
		number: 3,
		members: ["angelina", "andreas"]
	},
	{
		number: 5,
		members: ["kalle"]
	}
]
 
app.get('/', function (req, res) {
  res.render('index', {resitations: resitation_dummy_data})
})

console.log("Running on port 3000") 
app.listen(3000)
