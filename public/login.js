
	var mail_text = document.querySelector(".email");
	var passwd = document.querySelector(".passwd");

	document.querySelector(".submit").addEventListener("click", function() {
	//console.log(textfield.value); 
		var query = "SELECT f_name FROM users WHERE id = " + mail_text + " AND pwd = " + passwd + ";";
		$.post('/login', {query: query}, function(data) {
			if(data==='done') {
				console.log("jippi");
			}
		})
		mail_text = "";
		passwd = "";
	})
