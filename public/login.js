module.exports = function(connection) {
	var mail_text = document.querySelector(".email");
	var passwd = document.querySelector(".passwd");

	document.querySelector(".submit").addEventListener("click", function() {
	//console.log(textfield.value); 
		var query = "SELECT f_name FROM users WHERE id = " + mail_text + " AND pwd = " + passwd + ";";
		connection.query(query, function(err, rows, fields) {
			if(err) {
				console.log("ooooops");
			} else {
				if(rows.length != 1) {
					console.log("user not there");
				} else {
					console.log("yes! the user is named: " + rows[0].f_name);
				}
			}
		});
	//textfield.value = "";
	})
};
