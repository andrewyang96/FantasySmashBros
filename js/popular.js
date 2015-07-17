$.ajax({
	type: "GET",
	dataType: "json",
	async: true,
	url: "../popular/popular.json",
	success: function (data) {
		console.log(data);
	}
});