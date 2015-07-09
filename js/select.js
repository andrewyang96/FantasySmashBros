DEADLINE = 1437145200000 // 8:00 AM PST Friday June 17, 2015

/* Begin search code */

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

// TODO Change BASEURL
var BASEURL = "https://raw.githubusercontent.com/andrewyang96/FantasySmashBros/master/data/{0}.json";

$("input[name=searchQuery]").keydown(function (event) {
    if (event.which == 13) {
        event.preventDefault();
        // debug output
        var searchQuery = $("input[name=searchQuery]").val();
        var sortType = $("select[name=sortType]").val();
        var sortOrder = $("select[name=sortOrder]").val();
        var game = $("input[type=radio][name=game]:checked").val();
        $("#searchQueryResult").html(searchQuery);
        $("#gameResult").html(game);
        searchPlayers(searchQuery, game, sortType, sortOrder);
    }
});

var searchPlayers = function (searchQuery, game, sortType, sortOrder) {
    var url = BASEURL.format(game);
    $.getJSON(url, function (data) {
        var playerIDs = Object.keys(data);
        // Filter players
        var filteredIDs = playerIDs.filter(function (value) {
            var regexp = new RegExp(searchQuery, "i");
            var playerObj = data[value];
            var handleMatch = playerObj.handle ? playerObj.handle.match(regexp) : null;
            var nameMatch = playerObj.name ? playerObj.name.match(regexp) : null;
            return Boolean(handleMatch) || Boolean(nameMatch);
        });
        // Sort
        var sortFuncs = [nameSort, handleSort, popSort];
        filteredIDs.sort(function (a, b) {
            return sortFuncs[sortType](a, b, data) * sortOrder;
        });
        // Render
        renderResults(filteredIDs, data);
    });
};

var nameSort = function (a, b, data) {
    var a = data[a];
    var b = data[b];
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    } else {
        return 0;
    }
};

var handleSort = function (a, b, data) {
    var a = data[a];
    var b = data[b];
    if (a.handle < b.handle) {
        return -1;
    } else if (a.handle > b.handle) {
        return 1;
    } else {
        return 0;
    }
};

var popSort = function (a, b, data) {
    return nameSort(a, b); // TODO
};

var renderResults = function (IDs, data) {
    $("#search-results").html("");
    var el = "<li>Name: {0}, Handle: {1}</li>";
    IDs.forEach(function (key) {
        var playerObj = data[key];
        $("#search-results").append(el.format(playerObj.name, playerObj.handle));
    });
};