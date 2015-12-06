$("#calculator").submit(function (event) {
    // Calculate score
    var percent = $("input[name=percent]").val();
    var place = $("input[name=place]").val();
    var score = calculateScore(percent, place);
    $("#score").html(score);
    
    // Render score spread
    $("#percent").html(percent);
    var tbody = $("#scoreSpread > tbody");
    tbody.html("");
    calculateScoreSpread(percent).forEach(function (obj) {
        var html = "<tr><td>"+obj.place+"</td><td>"+obj.score+"</td></tr>";
        tbody.append(html);
    });
    console.log("done");
});