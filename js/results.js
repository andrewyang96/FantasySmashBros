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

var outcomesTemplateSrc = $("#outcomes-template").html();
var outcomesTemplate = Handlebars.compile(outcomesTemplateSrc);

var getRank = function (game, playerID, callback) {
	var URL = "http://fantasysmashbros.com/scoring/rankings.json";
	$.getJSON(URL, function (data) {
		var place = data[game][playerID].rank;
		callback(place);
	});
};

var getStandings = function (game, playerData, callback) {
	var BASEURL = "https://raw.githubusercontent.com/andrewyang96/FantasySmashBros/master/outcome/";
	$.getJSON(BASEURL + game + ".json", function (data) {
		callback(data, playerData);
	});
};

var renderStandings = function (data, playerData) {
	var playerObjs = [];
	var game = $("input[type=radio][name=game]:checked").val();
	ref.child(game).child("participants").once("value", function (snapshot) {
        // First get participants
        var participants = snapshot.val();
        var numParticipants = Infinity;
        if (participants) {
            numParticipants = Object.keys(participants).length;
        }
		// Convert array of IDs to playerObjs
		data.forEachDone(function (key, i, arr, done) {
	        var playerObj = playerData[key];
	        if (!playerObj.handle) {
	            // Assign empty player handle to empty string
	            playerObj.handle = "";
	        }
	        playerObj.id = key;
	        // Calculate popularity
	        ref.child(game).child("freqs").child(key).once("value", function (snap) {
	            var players = snap.val();
	            if (players) {
	                var numPlayers = Object.keys(players).length;
	                playerObj.popularity = round((numPlayers / numParticipants) * 100, 2);
	            } else {
	                playerObj.popularity = 0;
	            }
	            // Calculate score
	            playerObj.scoreSpread = calculateScoreSpread(playerObj.popularity);
	            playerObj.place = i+1;
	            playerObj.score = calculateScore(playerObj.popularity, playerObj.place);
	            playerObjs.push(playerObj);
	            done();
	        });
	    }, this, function () {
	        var context = {players: playerObjs};
	        var renderedTemplate = outcomesTemplate(context);
	        $("#outcomes-view").html(renderedTemplate);
	        attachToggleListenersNoBtn($("#outcomes-view"));
	        adjustPageHeight();
	    });
	});
};

var yourChoicesTemplateSrc = $("#your-choices-template").html();
var yourChoicesTemplate = Handlebars.compile(yourChoicesTemplateSrc);

var renderChoices = function (IDs, data) {
    var game = $("input[type=radio][name=game]:checked").val();
    var score = 0;
    if (IDs) {
        var playerObjs = [];
        IDs = Object.keys(IDs);
        ref.child(game).child("participants").once("value", function (snapshot) {
        	getStandings(game, null, function (standings) {
        		// First get participants
	            var participants = snapshot.val();
	            var numParticipants = Infinity;
	            if (participants) {
	                numParticipants = Object.keys(participants).length;
	            }
	            // Then iterate through Smasher IDs
	            IDs.forEachDone(function (key, i, arr, done) {
	                var playerObj = data[key];
	                if (!playerObj.handle) {
	                    // Assign empty player handle to empty string
	                    playerObj.handle = "";
	                }
	                playerObj.id = key;
	                // Calculate popularity
	                ref.child(game).child("freqs").child(key).once("value", function (snap) {
	                    var players = snap.val();
	                    if (players) {
	                        var numPlayers = Object.keys(players).length;
	                        playerObj.popularity = round((numPlayers / numParticipants) * 100, 2);
	                    } else {
	                        playerObj.popularity = 0;
	                    }
	                    // Calculate score
			            playerObj.scoreSpread = calculateScoreSpread(playerObj.popularity);
			            playerObj.place = standings.indexOf(playerObj.id);
			           	if (playerObj.place == -1) {
			           		playerObj.place = Infinity;
			           	} else {
			           		playerObj.place += 1;
			           	}
			            playerObj.score = calculateScore(playerObj.popularity, playerObj.place);
			            score += playerObj.score;
			            playerObjs.push(playerObj);
			            done();
	                });
	            }, this, function () {
	            	getRank(game, getUserID(), function (place) {
	            		var context = {players: playerObjs, score: score, place: place};
		                var renderedTemplate = yourChoicesTemplate(context);
		                $("#your-choices-view").html(renderedTemplate);
		                try {
		                    attachToggleListeners($("#your-choices"), false);
		                } catch (e) {
		                    attachToggleListenersNoBtn($("#your-choices"));
		                }
		                adjustPageHeight();
	            	});
	            });
        	});
        });
    } else {
        // Clear choices
        var context = {players: [], score: score};
        var renderedTemplate = yourChoicesTemplate(context);
        $("#your-choices-view").html(renderedTemplate);
        attachToggleListeners($("#your-choices"), false);
        adjustPageHeight();
    }
};

var adjustPageHeight = function () {
    // Reset height first
    $(".col").css({
        height: ""
    });
    var pageHeight = $(document).height();
    $(".col").css({
        height: pageHeight
    });
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
	var game = $("input[type=radio][name=game]:checked").val();
	getPlayerData(game, function (data) {
		getSmasherPopularity(renderPopularity);
	    getStandings(game, data, renderStandings);
		var ID = getUserID(); // Code stops here if not logged in
		ref.child(game).child("choices").child(ID).once("value", function (snapshot) {
		    var newChoices = snapshot.val();
		    renderChoices(newChoices, data);
		});
	});
});

var getPlayerData = function (game, callback) {
	var BASEURL = "https://raw.githubusercontent.com/andrewyang96/FantasySmashBros/master/data/";
    var url = BASEURL + game + ".json";
    $.getJSON(url, callback);
};

Array.prototype.forEachDone = function(fn, scope, lastfn) {
    for(var i = 0, c = 0, len = this.length; i < len; i++) {
        fn.call(scope, this[i], i, this, function() { // fn should be set up as fn(num, i, arr, done)
            ++c === len && lastfn();
        });
    }
};

function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

$(document).ready(function () {
	attemptLogin();
	var game = $("input[type=radio][name=game]:checked").val();
	getPlayerData(game, function (data) {
		getSmasherPopularity(renderPopularity);
	    getStandings(game, data, renderStandings);
		var ID = getUserID(); // Code stops here if not logged in
		ref.child(game).child("choices").child(ID).once("value", function (snapshot) {
		    var newChoices = snapshot.val();
		    renderChoices(newChoices, data);
		});
	});
});