BGIMAGES = [
    "http://nintendoenthusiast.com/wp-content/uploads/2014/07/evo2013-crowd-1.jpg",
    "http://i.imgur.com/8ozxAck.jpg",
    "http://gallery.rmpaul.com/Esports/Apex-2014/Salty-Suite/i-6bs9wcN/0/M/IMG_9954-M.jpg",
    "http://videogamewriters.com/wp-content/uploads/2013/07/evo2013-crowd-2.jpg",
    "http://gallery.rmpaul.com/Esports/Apex-2014/Salty-Suite/i-7vkc8PZ/1/M/IMG_9989-M.jpg",
    "http://guardianlv.com/wp-content/uploads/2015/02/14307215515_17982352c0_z.jpg",
    "https://cdn0.vox-cdn.com/thumbor/MjrmAgMoWXHLba07h4eGkMbLUhI=/0x0:1280x720/960x540/filters:format(webp)/cdn0.vox-cdn.com/uploads/chorus_image/image/45505904/evo_smash.0.0.jpg",
    "https://pbs.twimg.com/media/CKVRnDpW8AArcMw.jpg",
    "http://www.ssb-experience.com/wp-content/uploads/2013/07/news-apex-2014-logo.jpg",
    "http://static.ongamers.com/uploads/original/0/10/4504-2008452677-1O20u.jpg"
];

function BGImage(bgimgs) {
    this.bgimgs = bgimgs;
    this.limit = this.bgimgs.length;
    this.count = 0;
    this.thisObj = function () {return this};
};

BGImage.prototype.switchImg = function (thisObj) {
    thisObj.count += 1;
    thisObj.count %= thisObj.limit;
    var url = thisObj.bgimgs[thisObj.count];
    $(".splash").css({
        "background-image": 'url("' + url + '")'
    });
};

$(document).ready(function () {
    // Setup background image animations
    var bgi = new BGImage(BGIMAGES);
    setInterval(function () { bgi.switchImg(bgi.thisObj()); }, 5000);
});