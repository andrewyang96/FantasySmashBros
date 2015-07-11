var ref = new Firebase("https://fantasy-smash-bros.firebaseio.com/");

function FBLogin() {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
            console.log("Login failed:", error);
        } else {
            loginWithAuthData(authData);
        }
    });
}

function loginWithAuthData(authData) {
    var username = authData.facebook.displayName;
    var userID = authData.facebook.id;
    $("#fb-login").remove();
    // Init Firebase stuff
    setupChoicesLoader(userID);
}

function attemptLogin() {
    var user = ref.getAuth();
    if (user) {
        loginWithAuthData(user);
    }
}

/* Begin Firebase DOM functions */

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
};