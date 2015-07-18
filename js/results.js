var mostPopularTemplateSrc = $("#most-popular-template").html();
var mostPopularTemplate = Handlebars.compile(mostPopularTemplateSrc);

var getSmasherPopularity = function (callback) {
	$.getJSON("http://fantasysmashbros.com/popular/popular.json", callback);
};

var renderPopularity = function (data) {
	var game = $("input[type=radio][name=game]:checked").val();
	var lastUpdated = data.lastUpdated;
	var pops = data[game];
	var numParticipants = pops.numParticipants;
	var freqs = pops.freqs;
	freqs.forEach(function (player) {
		player.scoreSpread = calculateScoreSpread(player.popularity);
	});
	var context = {numParticipants: numParticipants, freqs: freqs, lastUpdated: lastUpdated};
	var renderedTemplate = mostPopularTemplate(context);
    $("#most-popular-view").html(renderedTemplate);
    var mp = $("#most-popular");
    attachToggleListeners(mp);
    adjustPageHeight();
};

var getStandings = function (callback) {
	// TODO
};

var renderStandings = function (data) {
	// TODO
};

$("#game-choice-form").change(function () {
	getYourChoices(renderYourChoices);
    getSmasherPopularity(renderPopularity);
    getStandings(renderStandings);
});

$(document).ready(function () {
	attemptLogin();
	getSmasherPopularity(renderPopularity);
});