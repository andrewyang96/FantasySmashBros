Array.prototype.forEachDone = function(fn, scope, lastfn) {
    for(var i = 0, c = 0, len = this.length; i < len; i++) {
        fn.call(scope, this[i], i, this, function() {
            ++c === len && lastfn();
        });
    }
};

function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

var searchResultsTemplateSrc = $("#search-results-template").html();
var searchResultsTemplate = Handlebars.compile(searchResultsTemplateSrc);

var renderSearchResults = function (IDs, data) {
    var game = $("input[type=radio][name=game]:checked").val();
    var playerObjs = [];
    IDs.forEachDone(function (key) {
        var playerObj = data[key];
        if (!playerObj.handle) {
            // Assign empty player handle to empty string
            playerObj.handle = "";
        }
        playerObj.id = key;
        // Calculate popularity
        ref.child(game).child("participants").once("value", function (snapshot) {
            var participants = snapshot.val();
            if (participants) {
                var numParticipants = Object.keys(participants).length;
                ref.child(game).child("freqs").child(key).once("value", function (snap) {
                    var players = snap.val();
                    if (players) {
                        var numPlayers = Object.keys(players).length;
                        playerObj.popularity = round((numPlayers / numParticipants) * 100, 2);
                    } else {
                        playerObj.popularity = 0;
                    }
                    playerObjs.push(playerObj);
                });
            } else {
                playerObj.popularity = 0;
                playerObjs.push(playerObj);
            }
        });
    }, this, function () {
        var context = {players: playerObjs};
        var renderedTemplate = searchResultsTemplate(context);
        $("#search-results-view").html(renderedTemplate);
        attachToggleListeners($("#search-results"), true);
        adjustPageHeight();
    });
};

var adjustPageHeight = function () {
    // Reset height first
    $(".col").css({
        height: ""
    });
    var pageHeight = $(document).height();
    console.log("New height:", pageHeight);
    $(".col").css({
        height: pageHeight
    });
};

var attachToggleListeners = function (olElement, isChooseBtn) {
    if (typeof isChooseBtn != "boolean") throw "isChooseBtn must be defined as boolean";
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
        // Attach add/remove listeners
        var game = $("input[type=radio][name=game]:checked").val();
        var userID = getUserID();
        if (isChooseBtn) {
            var chooseBtn = $(this).find(".choose-button");
            chooseBtn.on("click", function () {
                addPlayer($(this).attr("id"), userID, game);
            });
        } else { // else it's remove btn
            var removeBtn = $(this).find(".remove-button");
            removeBtn.on("click", function () {
                removePlayer($(this).attr("id"), userID, game);
            });
        }   
    });
};