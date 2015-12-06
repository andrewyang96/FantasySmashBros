// Expose a ref variable
var ref = new Firebase("https://fantasy-smash-bros.firebaseio.com/");

var getAuthData = function () {
	// Fetch the "token" cookie
	return JSON.parse(Cookies.get("authData"));
};
