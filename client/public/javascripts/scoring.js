function range(start, count) {
    return Array.apply(0, Array(count)).map(function (element, index) {
        return index + start;
    });
}

// Generate normalized places

var TIES = {1:1, 2:1, 3:1, 4:1, 5:2, 7:2, 9:4, 13:4, 17:8, 25:8};
var PLACES = {};
Object.keys(TIES).forEach(function (item) {
    item = Number(item);
    var avg = item + (TIES[item] - 1) / 2;
    range(item, TIES[item]).forEach(function (newItem) {
        newItem = Number(newItem);
        PLACES[newItem] = avg;
    });
});

var getNormPlace = function (place) {
	return PLACES[place];
};

// Scoring functions

var maxScoreFunc = function (percent) {
    // Exponential function that halves max score every 12.5% increase.
    // Max score is 1000
    var CONSTANT = 1 / Math.pow(2, (2/25.));
    return 1000. * Math.pow(CONSTANT, percent);
};

var resultScoreFunc = function (place) {
    // Power function such that 25th-32nd place is worth 1/8 of 1st place, assuming same percentages.
    // Returns a multiplier between 0 and 1.
    place = Math.floor(place);
    if (place <= 0) {
        throw "Place must be positive number";
    }
    if (place > 32) {
        return 0;
    }
    place = getNormPlace(place);
    var CONSTANT = -0.620747;
    return Math.pow(place, CONSTANT);
};

var calculateScore = function (percent, place) {
    var score = maxScoreFunc(percent) * resultScoreFunc(place);
    // Round score off to nearest tenth
    score = Math.round(score * 10) / 10;
    return score;
};

var calculateScoreSpread = function (percent) {
    var places = Object.keys(TIES);
    var objs = [];
    places.forEach(function (place) {
        objs.push({place: place, score: calculateScore(percent, place)});
    });
    return objs;
};