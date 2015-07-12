var searchResultsTemplateSrc = $("#search-results-template").html();
var searchResultsTemplate = Handlebars.compile(searchResultsTemplateSrc);

var renderSearchResults = function (IDs, data) {
    var playerObjs = [];
    IDs.forEach(function (key) {
        var playerObj = data[key];
        if (!playerObj.handle) {
            // Assign empty player handle to empty string
            playerObj.handle = "";
        }
        playerObj.id = key;
        // TODO add popularity and point calculations
        playerObjs.push(playerObj);
    });
    var context = {players: playerObjs};
    var renderedTemplate = searchResultsTemplate(context);
    $("#search-results-view").html(renderedTemplate);
    attachToggleListeners($("#search-results"));
    adjustPageHeight();
};

var adjustPageHeight = function () {
    // Reset height first
    $(".col").css({
        height: ""
    });
    var pageHeight = $(document).height();
    console.log("New height:", pageHeight);
    $(".col").css({
        height: pageHeight
    });
};

var attachToggleListeners = function (olElement) {
    olElement.find("li").each(function () {
        // Store heights beforehand
        $(this).data("fullHeight", $(this).outerHeight());
        var previewEl = $(this).find(".preview");
        var previewRelTop = previewEl.offset().top - $(this).offset().top;
        var previewHeight = previewEl.outerHeight(true);
        $(this).data("previewHeight", previewRelTop + previewHeight);
        $(this).css({
            height: $(this).data("previewHeight")
        });
        // Attach click listener to expand button
        var playerEl = $(this);
        var toggleBtn = $(this).find(".toggle-button");
        toggleBtn.on("click", function () {
            if (playerEl.hasClass("expanded")) {
                // Already expanded, need to shrink
                playerEl.removeClass("expanded");
                $(this).html("&#9660;");
                playerEl.animate({
                    height: playerEl.data("previewHeight")
                }, 200);
            } else {
                // Was shrunk, need to expand
                playerEl.addClass("expanded");
                $(this).html("&#9650;");
                playerEl.animate({
                    height: playerEl.data("fullHeight")
                }, 200);
            }
        });
        // Attach click listener to CHOOSE button
        var chooseBtn = $(this).find(".choose-button");
        chooseBtn.on("click", function () {
            var game = $("input[type=radio][name=game]:checked").val();
            var userID = getUserID();
            addPlayer($(this).attr("id"), userID, game);
        });
    });
}