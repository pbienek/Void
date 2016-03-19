Number.prototype.clamp = function (min, maX) {
    return Math.min(Math.max(this, min), maX);
};

//COLLISION DETECTION
var intersectionCheck = function (s1, s2) {
    //Thanks http://leetcode.com/2011/05/determine-if-two-rectangles-overlap.html
    var P1 = {x : s1.x, y : s1.y},
        P2 = {x : (s1.x + s1.width), y : (s1.y + s1.height)},
        P3 = {x : s2.x, y : s2.y},
        P4 = {x : (s2.x + s2.width), y : (s2.y + s2.width)};

    return !(P2.y < P3.y || P1.y > P4.y || P2.x < P3.x || P1.x > P4.x);
};


function speedLimit(speed, top_speed) {

    // CLAMP top speed - Otherwise the Player accelerates indefinitely
    if (Math.abs(speed) > top_speed) {
        if (speed > 0) {
            speed = top_speed;
        } else {
            speed = (0 - top_speed);
        }
    }

    return speed;
}

function outOfBounds(pos_X, pos_Y) {

    return (pos_X > this.screenW || pos_X < 0 || pos_Y > this.screenH || pos_Y < 0);
}


function getDistance(current_pos_X, current_pos_Y, target_pos_X, target_pos_Y) {
    //THANKS TO - http://snipplr.com/view/47207/
    var XS,
        YS = 0;

    XS = current_pos_X - target_pos_X;
    XS = (XS * XS);

    YS = current_pos_Y - target_pos_Y;
    YS = (YS * YS);

    return Math.sqrt(XS + YS);

}



function normalize(norm) {
    var len = Math.sqrt(norm.x * norm.x + norm.y * norm.y);
    norm.x /= len;
    norm.y /= len;

    return norm
}



function truncate(vector, max) {
    var i = max / 2;

    i = i < 1.0 ? 1.0 : i;

    return {
        x : vector.x * i,
        y : vector.y * i
    }
}


function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomNumFloat(min, max) {

    return Math.random() * (max - min) + min;
}



//function inViewport (obj) {
//
//    var scrnWidth  = document.getElementById('game-container').offsetWidth;
//    var scrnHeight = document.getElementById('game-container').offsetHeight;
//    var margin = 500;
//
//    var viewport = {
//        x : $.Player.x - (scrnWidth  + margin),
//        y : $.Player.y - (scrnHeight + margin),
//        width : scrnWidth,
//        height: scrnHeight
//    }
//}


function getStationByID(id) {

    for (var i = 0; i < $.Universe.locations.length; i++) {

        if ($.Universe.locations[i].id === id) {

            return $.Universe.locations[i];
        }

    }
}



function findCloseObjects (x, y, threshold) {

    var allObjects   = [];
    var closeObjects = [];

    allObjects = $.Universe.ships.concat($.Universe.locations, $.Universe.objects);


    var i = allObjects.length;
    while (i--) {
        var objectDistance = getDistance(x, y, allObjects[i].x, allObjects[i].y);

        if (objectDistance <= threshold) {
            closeObjects.push(allObjects[i]);
        }
    }

    return closeObjects;
}



//function findCloseObjects (x, y) {
//
//    var allObjects   = [];
//    var closeObjects = [];
//    var threshold    = 1000;
//
//    allObjects = $.Universe.ships.concat($.Universe.locations, $.Universe.objects);
//
//    var i = allObjects.length;
//    while (i--) {
//        var objectDistance = getDistance(x, y, allObjects[i].x, allObjects[i].y);
//
//        if (objectDistance <= threshold) {
//            closeObjects.push(allObjects[i]);
//        }
//    }
//
//    return closeObjects;
//}





function checkSpacing(x, y, list, space) {

    var spacingOK = 0;

    var i = list.length;
    while (i--) {

        var dist = getDistance(x, y, list[i].x, list[i].y);

        if (dist < space) {
            spacingOK++;
        }
    }

    return (!spacingOK);
}


function fps () {

}













