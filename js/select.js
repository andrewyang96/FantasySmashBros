var addPlayer = function (playerID, userID, game) {
    // WHERE THE REAL MAGIC IS!
    console.log("Choosing " + playerID);
    if (playerID && userID && game) {
        // Validate selection
        ref.child(game).child("choices").child(userID).once("value", function (snapshot) {
            var choices = snapshot.val();
            if (canAddPlayer(choices, playerID)) {
                ref.child(game).child("choices").child(userID).child(playerID).set("true", function () {
                    console.log("Added player " + playerID);
                });
            } else {
                console.log("Cannot add " + playerID);
            }
        });
    } else {
        console.log("You must specify a player, or you must be logged in, or you must specify a game.");
    }
};

var removePlayer = function (playerID, userID, game) {
    console.log("Removing " + playerID);
    if (playerID && userID && game) {
        ref.child(game).child("choices").child(userID).child(playerID).remove(function () {
            console.log("Successfully removed player " + playerID);
        });
    } else {
        console.log("You must specify a player, or you must be logged in, or you must specify a game.");
    }
}

var canAddPlayer = function (choices, newChoice) {
    // Choices cannot be more than length 6 and cannot contain duplicates
    if (!choices) {
        return true;
    } else {
        var choices = Object.keys(choices);
        return choices.length < 6 && choices.indexOf(newChoice) == -1
    }
};

function setupChoicesLoader(ID) {
    if (!ID) ID = getUserID();
    ref.child("ssb4").child("choices").child(ID).on("value", function (snapshot) {
        var newChoices = snapshot.val();
        // Re-render template
        var game = $("input[type=radio][name=game]:checked").val();
        if (game == "ssb4") {
            getPlayerData(game, function (data) {
                renderChoices(newChoices, data);
            });
        }
    });
    ref.child("ssbm").child("choices").child(ID).on("value", function (snapshot) {
        var newChoices = snapshot.val();
        // Re-render template
        var game = $("input[type=radio][name=game]:checked").val();
        if (game == "ssbm") {
            getPlayerData(game, function (data) {
                renderChoices(newChoices, data);
            });
        }
    });
}

$("#game-choice-form").change(function () {
    var game = $("input[type=radio][name=game]:checked").val();
    ref.child(game).child("choices").child(ID).once("value", function (snapshot) {
        var newChoices = snapshot.val();
        getPlayerData(game, function (data) {
            renderChoices(newChoices, data);
        });
    });
});

var yourChoicesTemplateSrc = $("#your-choices-template").html();
var yourChoicesTemplate = Handlebars.compile(yourChoicesTemplateSrc);

var renderChoices = function (IDs, data) {
    var playerObjs = [];
    if (IDs) {
        IDs = Object.keys(IDs);
        IDs.forEach(function (key) {
            var playerObj = data[key];
            if (!playerObj.handle) {
                // Assign empty player handle to empty string
                playerObj.handle = "";
            }
            playerObj.id = key;
            // TODO add popularity and point calculations
            playerObjs.push(playerObj);
        });
        var context = {players: playerObjs};
        var renderedTemplate = yourChoicesTemplate(context);
        $("#your-choices-view").html(renderedTemplate);
        attachToggleListeners($("#your-choices"), false);
        adjustPageHeight();
    }
};

/* Main function */

$(document).ready(function () {
    // NEED TO IMPORT scoring.js, login.js, search.js, and templates.js beforehand
    attemptLogin();
    renderSearchResults([]);
});