$(document).ready(function () {
	var absurd = Absurd();
	$.getJSON("/api/flairs", function (data) {
		// Add period before each key
		Object.keys(data).forEach(function (cls) {
			data["." + cls] = data[cls];
			delete data[cls];
		});
		absurd.add(data).compile(function (err, css) {
			if (err) throw err;
			$('<style type="text/css"></style>').appendTo("head").html(css);
		});
	});
});