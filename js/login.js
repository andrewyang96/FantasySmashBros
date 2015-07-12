var ref = new Firebase("https://fantasy-smash-bros.firebaseio.com/");
var DEADLINE = 1437145200000 // 8:00 AM PST Friday June 17, 2015

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

var getUserID = function () {
    return ref.getAuth().facebook.id;
};