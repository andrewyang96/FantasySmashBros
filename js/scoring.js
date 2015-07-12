function range(start, count) {
    return Array.apply(0, Array(count)).map(function (element, index) {
        return index + start;
    });
}

var maxScoreFunc = function (percent) {
    // Exponential function that halves max score every 20% increase.
    // Max score is 1000
    var CONSTANT = 1 / Math.pow(2, (1/20.));
    return 1000. * Math.pow(CONSTANT, percent);
};

// Generate normalized places

var TIES = {1:1, 2:1, 3:1, 4:1, 5:2, 7:2, 9:4, 13:4, 17:8, 25:8, 33:16, 49:16};
var PLACES = {};
Object.keys(TIES).forEach(function (item) {
    item = Number(item);
    var avg = item + (TIES[item] - 1) / 2;
    range(item, TIES[item]).forEach(function (newItem) {
        newItem = Number(newItem);
        PLACES[newItem] = avg;
    });
});

var resultScoreFunc = function (place) {
    // Power function such that 49th-64th place is worth 1/10 of 1st place, assuming same percentages.
    // Returns a multiplier between 0 and 1.
    place = Math.floor(place);
    if (place <= 0) {
        throw "Place must be positive number";
    }
    if (place > 64) {
        return 0;
    }
    place = PLACES[place];
    var CONSTANT = -0.57076;
    return Math.pow(place, CONSTANT);
};

var calculateScore = function (percent, place) {
    var score = maxScoreFunc(percent) * resultScoreFunc(place);
    score = Math.round(score * 100) / 100;
    return score;
};

var calculateScoreSpread = function (percent) {
    var ret = []
    var places = [1,2,3,4,5,7,9,13,17,25,33,49];
    places.forEach(function (place) {
        var score = calculateScore(percent, place);
        ret.push({place: place, score: score});
    });
    return ret;
};