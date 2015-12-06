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

    // Setup x-editable radiolist for flair selection
    $("#registrationFlair").editable({
        value: "flair-smashlogo",
        showbuttons: "bottom",
        source: "/api/flairs?xeditable=1",
        display: function (value, sourceData) {
            // Manipulate x-editable link to use image
            var selected = sourceData.filter(function (item) {return item.value == value})[0];
            var newHTML = '<span title="' + selected.text + '" class="flair ' + value + '"></span>';
            // Also add hidden input field
            newHTML += '<input name="flair" value="' + value + '" style="display:none" />';
            $(this).html(newHTML);
        }
    });
    
    // Manipulate x-editable popup to use image
    $("#registrationFlair").click(function () {
        var labels = $(".editable-radiolist > label");
        var labelsCount = labels.length;
        for (var i = 0; i < labelsCount; i++) {
            var value = $(labels[i]).find("input").val();
            var span = $(labels[i]).find("span")
            var text = span.text();
            var newHTML = '<span title="' + text + '" class="flair ' + value + '"></span>';
            $(labels[i]).append(newHTML);
            span.css({"display": "none"});
        }
        // Set offset of x-editable popup to the selection offset
        var offset = $("#registrationFlair").offset();
        var popupHeight = $(".editable-popup").height() + 10;
        offset.top -= popupHeight;
        offset.left -= ($(".editable-popup > .arrow").position().left - 10);
        $(".editable-popup").offset(offset);
    });
    
    // On signin form submit
    $("#signin-view > form").submit(function (event) {
        event.preventDefault();
        console.log("Trying to sign in!");
        var email = $(this).find("input[name=email]").val();
        var password = $(this).find("input[name=password]").val();
        var rememberMe = $(this).find("input[name=rememberMe]").get(0).checked;
        // Authenticate here
        ref.authWithPassword({
            email: email,
            password: password
        }, function (error, authData) {
            if (error) {
                alert("Login failed!");
            } else {
                // Set authData cookie
                Cookies.set("authData", authData);
                // Redirect to dashboard
                window.location.pathname = "/play";
            }
        });
    });

    $("#forgot-password-view > form").submit(function (event) {
        event.preventDefault();
        console.log("Forgot password!");
        var email = $(this).find("input[name=email]").val();
        console.log("Email Address:", email);
    });
});