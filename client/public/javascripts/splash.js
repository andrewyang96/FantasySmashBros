$("#explanation-btn").click(function () {
	$("html, body").animate({
		scrollTop: $("#explanation").offset().top
	}, 500);
});

// Really hacky way to synchronize localStorage and cookies
if (!window.localStorage.getItem('token')) document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';