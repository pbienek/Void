$.PirateShip = function () {
    $.Ship.call(this);
};

$.PirateShip.prototype = new $.Ship();

$.PirateShip.prototype.constructor = $.PirateShip;


$.PirateShip.prototype.create = function () {

    this.shipSVG  = pirateShip;
    this.width    = 60;
    this.height   = 60;


    this.currentTarget    = null;
    this.potentialTargets = [];


    this.targetRange = 2000;
    this.fireRange   = 800;
    this.lastShot    = 0;
    this.laser = {
        coolDown : 3,
        hp       : 10,
        speed    : 8,
        width    : 40,
        height   : 2,
        colour   : '233,36,67'
    };

    this.topSpeed     = 11;
    this.acceleration = 0.05;

    this.faction = 'outlaw';
    this.type    = 'pirate';
    this.bounty  = 40;



};



$.PirateShip.prototype.ai = function () {
    //
    //console.log('testing')

    this.closeObjects = findCloseObjects(this.x, this.y, 2000);
    if(getDistance(this.x, this.y, $.Player.x, $.Player.y) <= 2000) {
        this.closeObjects.push($.Player);
    }


    //update targets
    this.potentialTargets = [];
    this.potentialThreats = [];
    var s = this.closeObjects.length;

    while (s--) {
        var co = this.closeObjects[s];
        if ($.gameTime > this.lastHit + 5 && !co.docked && !co.dead && co.type !== 'station' && co.faction !== 'outlaw') {

            this.potentialTargets.push({
                id       : co.id,
                x        : co.x,
                y        : co.y,
                velocity : {x :co.velocity.x, y :co.velocity.y} ,
                faction  : co.faction,
                priority : this.priority(co)
            });

            if (co.type ==='police'){
                this.potentialThreats.push({
                    id       : co.id,
                    x        : co.x,
                    y        : co.y,
                    velocity : {x :co.velocity.x, y :co.velocity.y} ,
                    faction  : co.faction,
                    priority : this.priority(co)
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

        this.combatMode();
    } else {

        this.mode = 'seek';
        //Choose random station
        if (this.targetDestination.distance < 200 || (this.targetDestination.x === 0 && this.targetDestination.y === 0)) {
            this.targetDestination.x = getRandomNum(0, $.Universe.width);
            this.targetDestination.y = getRandomNum(0, $.Universe.height);
            this.targetDestination.velocity.x = 0;
            this.targetDestination.velocity.y = 0;
        }
    }


};





$.PirateShip.prototype.priority = function(ship) {

    var priority = 0;

    //if(ship.type === 'player') {
    //    priority += 5;
    //}

    if(this.hitList[ship.id]) {
        priority += this.hitList[ship.id];
    }


    return priority;
};






$.PirateShip.prototype.fireAtTarget = function () {

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