var getSmasherPopularity = function (callback) {
	$.getJSON("http://fantasysmashbros.com/popular/popular.json", callback);
};

var renderPopularity = function (data) {
	// TODO
};

var getStandings = function (callback) {
	// TODO
};

var renderStandings = function (data) {
	// TODO
};

$(document).ready(function () {
	attemptLogin();
	getSmasherPopularity(renderPopularity);
});