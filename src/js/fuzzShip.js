$.FuzzShip = function () {
    $.Ship.call(this);
};

$.FuzzShip.prototype = new $.Ship();

$.FuzzShip.prototype.constructor = $.FuzzShip;


$.FuzzShip.prototype.create = function () {

    this.shipSVG  = fuzzShip;
    this.width    = 60;
    this.height   = 60;


    this.currentTarget    = null;
    this.potentialTargets = [];

    this.targetRange = 2000;
    this.fireRange   = 800;
    this.lastShot    = 0;
    this.laser = {
        coolDown : 2,
        hp       : 20,
        speed    : 11,
        width    : 40,
        height   : 2,
        colour   : '36,213,243'
    };

    this.topSpeed     = 9;
    this.acceleration = 0.05;
    this.faction      = 'tradeAlliance';
    this.type         = 'police';

    this.x = this.home.x;
    this.y = this.home.y;
    this.atHome = false;
};



$.FuzzShip.prototype.ai = function () {


    this.closeObjects = findCloseObjects(this.home.x, this.home.y, 2000);
    if(getDistance(this.home.x, this.home.y, $.Player.x, $.Player.y) <= 2000) {
        this.closeObjects.push($.Player);
    }

    //update targets
    this.potentialTargets = [];
    var s = this.closeObjects.length;
    while (s--) {
        var co = this.closeObjects[s];
        if (co.faction !== this.faction) {

            if (co.bounty > 0) {
                this.potentialTargets.push({
                    id       : co.id,
                    x        : co.x,
                    y        : co.y,
                    velocity : {x :co.velocity.x, y :co.velocity.y} ,
                    faction  : co.faction,
                    priority : this.priority
                });
            }
        }
    }

    this.potentialTargets.sort(function(a,b) {
        if (a.priority < b.priority) {
            return 1;
        } else {
            if (a.priority > b.priority) {
                return -1;
            }  else {
                return 0;
            }
        }
    });




    if (this.potentialTargets.length > 0) {
        this.attackMode();
    } else {
        this.mode = 'seek';
        this.targetDestination.x = this.home.x + 250;
        this.targetDestination.y = this.home.y + 250;
        this.targetDestination.velocity.x = 0;
        this.targetDestination.velocity.y = 0;
    }

};


$.FuzzShip.prototype.priority = function(ship) {

    var priority = 0;

    //if (ship.faction === 'outlaw') {
    //    priority += 10;
    //}
    if (ship.faction === 'pirate') {
        priority += 10;
    }
    if (this.hitList[ship.id]) {
        priority += this.hitList[ship.id];
    }


    return priority;
};


$.FuzzShip.prototype.attackMode = function () {
    this.atHome = false;
    this.combatMode();
};



$.FuzzShip.prototype.fireAtTarget = function () {

    if ($.gameTime > (this.lastShot + this.laser.coolDown)) {

        var angle  = Math.atan2(this.potentialTargets[0].y - this.y, this.potentialTargets[0].x - this.x);
        var origin = {x : this.x, y : this.y};
        origin = {
            x       : origin.x += (40 * Math.cos(angle)),
            y       : origin.y += (40 * Math.sin(angle)),
            velX    : this.velocity.x,
            velY    : this.velocity.y,
            faction : this.faction
        };

        $.Projectiles.add(angle, origin, this.laser.speed, this.laser.colour, this.laser.width, this.laser.height, this.laser.hp);
        this.lastShot = $.gameTime;
    }

};