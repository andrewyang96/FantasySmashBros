var PLACES = [1,2,3,4,5,7,9,13,17,25];

$("#calculator").submit(function (event) {
    // Calculate score
    var percent = $("input[name=percent]").val();
    var proportion = percent / 100;
    var place = $("input[name=place]").val();    
    
    // Render score spread
    $("#percent").html(percent);
    
    $.get("http://localhost:4747/scoring/scorespread?proportion=" + proportion, function (data) {
        var spread = JSON.parse(data).scoreSpread;

        if (place <= 32) {
            for (var i = 0; i < PLACES.length; i++) {
                if (PLACES[i] >= place) {
                    $("#score").html(spread[i]);
                    break;
                }
            }
        } else {
            $("#score").html(0);
        }

        var tbody = $("#scoreSpread > tbody");
        tbody.html("");
        for (var i = 0; i < PLACES.length; i++) {
            var html = "<tr><td>" + PLACES[i] + "</td><td>" + spread[i] + "</td></tr>";
            tbody.append(html);
        }
    });
});