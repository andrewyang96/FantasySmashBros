var addPlayer = function (playerID, userID, game) {
    // WHERE THE REAL MAGIC IS!
    console.log("Choosing " + playerID);
    if (userID) {
        // Validate selection
        ref.child(game).child("choices").child(userID).once("value", function (snapshot) {
            var choices = Object.keys(snapshot.val());
            if (canAddPlayer(choices, playerID)) {
                ref.child(game).child("choices").child(userID).child(playerID).set("true", function () {
                    console.log("Added player " + playerID);
                });
            }
        });
    } else {
        console.log("You're not logged in");
    }
};

var canAddPlayer = function (choices, newChoice) {
    // Choices cannot be more than length 6 and cannot contain duplicates
    if (!choices) {
        return true;
    } else {
        return choices.length < 6 && choices.indexOf(newChoice) == -1
    }
};

function setupChoicesLoader(ID) {
    var game = $("input[type=radio][name=game]:checked").val();
    ref.child(game).child(ID).on("value", function (snapshot) {
        console.log("newChoices:");
        console.log(newChoices);
        var newChoices = snapshot.val();
        // Re-render template
        getPlayerData(game, function (data) {
            renderChoices(newChoices, data);
        });
    });
}

var yourChoicesTemplateSrc = $("#search-results-template").html();
var yourChoicesTemplate = Handlebars.compile(yourChoicesTemplateSrc);

var renderChoices = function (IDs, data) {
    var playerObjs = [];
    if (IDs) {
        IDs.forEach(function (key) {
        var playerObj = data[key];
        if (!playerObj.handle) {
            // Assign empty player handle to empty string
            playerObj.handle = "";
        }
        // TODO add popularity and point calculations
        playerObjs.push(playerObj);
    });
    var context = {players: playerObjs};
    var renderedTemplate = yourChoicesTemplate(context);
    $("#your-choices-view").html(renderedTemplate);
    attachToggleListeners($("#your-choices"));
    adjustPageHeight();
    }
};

/* Main function */

$(document).ready(function () {
    // NEED TO IMPORT scoring.js, login.js, search.js, and templates.js beforehand
    attemptLogin();
    renderSearchResults([]);
});