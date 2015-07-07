$("#explanation-button").click(function () {
	$("html, body").animate({
		scrollTop: $("#explanation").offset().top
	}, 500);
});