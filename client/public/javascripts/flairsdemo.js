var flairsDemoTemplateSrc = $("#flairsDemoTableTemplate").html();
var flairsDemoTemplate = Handlebars.compile(flairsDemoTemplateSrc);

$.getJSON("/api/flairs", function (data) {
	$.getJSON("/api/flairs", function (data) {
		var context = {flairs: data};
		var renderedTemplate = flairsDemoTemplate(context);
		$("#flairsDemoTableTemplateView").html(renderedTemplate);
	});
});