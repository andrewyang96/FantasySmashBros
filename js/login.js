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
    username = authData.facebook.displayName;
    avatarURL = authData.facebook.cachedUserProfile.picture.data.url;
    userID = authData.facebook.id;
    $("#fb-login").remove();
    console.log(authData);
}

function attemptLogin() {
    var user = ref.getAuth();
    if (user) {
        loginWithAuthData(user);
    }
}