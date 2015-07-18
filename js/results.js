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
    attachToggleListenersNoBtn(mp);
    adjustPageHeight();
};

var getStandings = function (callback) {
	// TODO
};

var renderStandings = function (data) {
	// TODO
};

var attachToggleListenersNoBtn = function (olElement) {
    olElement.find("li").each(function () {
        // Store heights beforehand
        $(this).data("fullHeight", $(this).outerHeight());
        var previewEl = $(this).find(".preview");
        var previewRelTop = previewEl.offset().top - $(this).offset().top;
        var previewHeight = previewEl.outerHeight(true);
        $(this).data("previewHeight", previewRelTop + previewHeight);
        $(this).css({
            height: $(this).data("previewHeight")
        });
        // Attach click listener to expand button
        var playerEl = $(this);
        var toggleBtn = $(this).find(".toggle-button");
        toggleBtn.on("click", function () {
            if (playerEl.hasClass("expanded")) {
                // Already expanded, need to shrink
                playerEl.removeClass("expanded");
                $(this).html("&#9660;");
                playerEl.animate({
                    height: playerEl.data("previewHeight")
                }, 200);
            } else {
                // Was shrunk, need to expand
                playerEl.addClass("expanded");
                $(this).html("&#9650;");
                playerEl.animate({
                    height: playerEl.data("fullHeight")
                }, 200);
            }
        });
    });
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