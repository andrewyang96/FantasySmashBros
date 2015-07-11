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
    ref.child(ID).on("value", function (snapshot) {
        console.log("newChoices:");
        console.log(newChoices);
        var newChoices = snapshot.val();
        // Re-render template
        renderChoices(newChoices, data);
    });
}

var renderChoices = function (IDs, data) {
    // TODO
};