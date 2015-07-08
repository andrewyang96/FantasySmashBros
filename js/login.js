var ref = new Firebase("https://fantasy-smash-bros.firebaseio.com/");

function FBLogin() {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
        loginWithAuthData(authData);
    });
}

function loginWithAuthData(authData) {
    username = authData.facebook.displayName;
    avatarURL = authData.facebook.cachedUserProfile.picture.data.url;
    userID = authData.facebook.id;
}

function attemptLogin() {
    var user = ref.getAuth();
    if (user) {
        loginWithAuthData(user);
    } else {
        $("#fb-login").click(function () {
            FBLogin();
        });
    }
}

$(document).ready(function () {
    attemptLogin();
});