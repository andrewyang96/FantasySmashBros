function passwordMatch() {
    var password = $("#registration-view input[name=password]").val();
    var confirmPassword = $("#registration-view input[name=confirmPassword]").val();
    if (password != confirmPassword) {
        $("#registration-view input[name=confirmPassword]").get(0).setCustomValidity("Passwords must match.");
    } else {
        $("#registration-view input[name=confirmPassword]").get(0).setCustomValidity("");
    }
}

$(document).ready(function () {
    // Setup password validators
    $("#registration-view input[name=password]").get(0).onchange = passwordMatch;
    $("#registration-view input[name=confirmPassword]").get(0).onchange = passwordMatch;
    
    // Setup form transition listeners
    $("#btn-registration").click(function (event) {
        $("#signin-view").fadeOut(200, function () {
            $("#registration-view").fadeIn(200);
        });
    });
    $("#btn-cancel-registration").click(function (event) {
        $("#registration-view").fadeOut(200, function () {
            $("#signin-view").fadeIn(200);
        });
    });
    $("#btn-forgot-password").click(function (event) {
        $("#signin-view").fadeOut(200, function () {
            $("#forgot-password-view").fadeIn(200);
        });
    });
    $("#btn-cancel-forgot-password").click(function (event) {
        $("#forgot-password-view").fadeOut(200, function () {
            $("#signin-view").fadeIn(200);
        });
    });

    $("#forgot-password-view > form").submit(function (event) {
        event.preventDefault();
        console.log("Forgot password!");
        var email = $(this).find("input[name=email]").val();
        console.log("Email Address:", email);
    });
});