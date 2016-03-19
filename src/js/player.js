$.Player = function () {};

$.Player.init = function () {

    // DRAW SETTINGS
    this.id      = 'PLAYER';
    this.canvas  = $.playerCanvas;
    this.x       = $.Universe.width/2;
    this.y       = $.Universe.width/2;
    this.center  = { x : 0, y : 0 };
    this.radius  = 40;
    this.width   = 60;
    this.height  = 30;
    this.shipSVG = playerShip;

    //  POSITIONAL & PHYSICS
    this.rotation     = 0;
    this.velocity     = { x : 0, y : 0 };
    this.topSpeed     = 7;
    this.friction     = 0;
    this.acceleration = 0.04;
    this.touching     = false;

    // SHIP STATS
    //this.cargoSpace = 100;
    this.cargoBay   = {};
    this.hull       = {capacity: 200, total: 200};
    this.shield     = {capacity: 200, total: 200, regenerationRate : 0.1};
    this.fuel       = {capacity: 200, total: 200};
    this.laser      = {
        coolDown : 5,
        hp       : 20,
        speed    : 8,
        width    : 40,
        height   : 2,
        colour   : '223, 88, 235'
    };
    //this.laserCoolDown  = 4;
    this.lastShot       = 0;
    this.closestStation = {};
    this.dockingRange   = false;
    this.docked         = false;
    this.dead = false;

    //PLAYER STATS
    //this.score   = 0;
    this.credits = 1000;
    this.faction = 'player';
    this.closeObjects = [];

    this.radarRadius  = 4000;

    //this.stats = {
    //    kills    : 0,
    //    profit   : 0,
    //    distance : 0,
    //    bounty   : 0
    //};

    //$.Universe.ships.push(this);
};


$.Player.movement = function () {

    this.keyboardControls();

    if ($.KM.leftMouseDown) {
        if(this.fuel.total > 0 && !this.dead) {
            this.velocity.x += (this.acceleration * Math.cos(this.rotation));
            this.velocity.y += (this.acceleration * Math.sin(this.rotation));
            this.fuel.total -= 0.1;
            this.thrustEffect();
        }
    }

    this.velocity.x = speedLimit(this.velocity.x,  this.topSpeed);
    this.velocity.y = speedLimit(this.velocity.y,  this.topSpeed);

    this.collisionDetection();

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.rotation = getRotation();

    function getRotation() {
        var xDistance = $.KM.mousePos.x - ($.screenW / 2),
            yDistance = $.KM.mousePos.y - ($.screenH / 2),
            radians   = Math.atan2(yDistance, xDistance);

        return (radians);
    }
};


$.Player.collisionDetection = function () {

    var isTouching = false;
    var i = this.closeObjects.length;
    while (i--) {

        var distance = getDistance(this.x, this.y, this.closeObjects[i].x, this.closeObjects[i].y);

        if (distance <= (this.radius + this.closeObjects[i].radius)) {

            if (!this.touching) {
                //var deep = (this.radius + this.closeObjects[i].radius) - distance;
                this.velocity.x *= -0.5;//(this.velocity.x * -1 ) - (this.velocity.x/2);
                this.velocity.y *= -0.5;//(this.velocity.y * -1 ) - (this.velocity.y/2);
            }
            this.touching = true;
            isTouching    = true;
        }
    }
    this.touching = isTouching;
};



$.Player.keyboardControls = function () {

    //if ($.KM.map[87]) {
    //    if(this.fuel.total > 0) {
    //        this.velocity.y -= this.acceleration;
    //        this.fuel.total -= 0.1;
    //        this.thrustEffect();
    //    }
    //}
    //if ($.KM.map[83]) {
    //    if(this.fuel.total > 0) {
    //        this.velocity.y += this.acceleration;
    //        this.fuel.total -= 0.1;
    //        this.thrustEffect();
    //    }
    //}
    //if ($.KM.map[65]) {
    //    if(this.fuel.total > 0) {
    //        this.velocity.x -= this.acceleration;
    //        this.fuel.total -= 0.1;
    //        this.thrustEffect();
    //    }
    //}
    //if ($.KM.map[68]) {
    //    if(this.fuel.total > 0) {
    //        this.velocity.x += this.acceleration;
    //        this.fuel.total -= 0.1;
    //        this.thrustEffect();
    //    }
    //}

    //Space bar TODO remove from production
    //if ($.KM.map[32]) {
    //    this.velocity.x = 0;
    //    this.velocity.y = 0;
    //}

    //F Key
    if ($.KM.map[70] && this.dockingRange) {
        this.dock();
    }

    //P key
    //if ($.KM.map[80]) {
    //    if(!$.paused){
    //        $.paused = true;
    //        $.UI.showMessage('GAME PAUSED');
    //    } else {
    //        $.UI.closeMessage();
    //        $.paused = false;
    //    }
    //}
};



$.Player.thrustEffect = function () {
    var particleEffect = new $.ParticleEmiter();
    particleEffect.init(this.x, this.y, 'thrust', this);
    $.particleInstances.push(particleEffect);
};




$.Player.casualUpdate = function () {

    if (!this.docked) {
        if ($.KM.rightMouseDown) {
            this.fireWeapon();
        }

        this.dockingCheck();

        this.closeObjects = findCloseObjects(this.x, this.y, 1000);

    }


    if (this.shield.total  <  this.shield.capacity) {
        this.shield.total += this.shield.regenerationRate;
    }
};



$.Player.dockingCheck = function () {

    var dockingDistance = 500;
    var searching       = true;
    var l = $.Universe.locations.length;
    while (l-- && searching) {

        var stationDistance = getDistance(this.x, this.y, $.Universe.locations[l].x, $.Universe.locations[l].y);

        if (stationDistance <= dockingDistance) {
            this.closestStation = $.Universe.locations[l];
            this.dockingRange   = true;
            searching           = false;
            $.UI.showMessage('<span class="title">' + $.Universe.locations[l].name + '</span><br /> Press "F" to dock with this Space Station.');
        } else {
            if ($.UI.messageIsOpen) {
                $.UI.closeMessage();
            }
            this.dockingRange = false;
        }
    }
};



$.Player.dock = function () {

    this.docked     = true;
    this.velocity.x = 0;
    this.velocity.Y = 0;
    this.fuel.total = Math.round(this.fuel.total);
    this.fuel.hull  = Math.round(this.hull.total);

    this.closestStation.dockedShips++;

    $.UI.showStationMenu(this.closestStation);
};



$.Player.undock = function () {
    this.docked = false;
    this.closestStation.dockedShips--;
    this.cleanInventory();
};



$.Player.cleanInventory = function () {

    for (var name in this.cargoBay) {
        if (this.cargoBay[name].qnt <= 0){
            delete this.cargoBay[name];
        }
    }
};







$.Player.fireWeapon = function () {
    var angle = Math.atan2($.KM.mousePos.y - $.screenH/2, $.KM.mousePos.x - $.screenW/2);
    var speed = Math.sqrt((this.velocity.x*this.velocity.x) + (this.velocity.y*this.velocity.y)) + this.laser.speed;
    var origin = { x : this.x, y : this.y};
    origin = {
        x       : origin.x += (40 * Math.cos(angle)),
        y       : origin.y += (40 * Math.sin(angle)),
        velX    : this.velocity.x,
        velY    : this.velocity.y,
        faction : this.faction,
        id      : this.id
    };


    if ($.gameTime > (this.lastShot + this.laser.coolDown)) {
        $.Projectiles.add(angle, origin, this.laser.speed, this.laser.colour, this.laser.width, this.laser.height, this.laser.hp);
        this.lastShot = $.gameTime;
    }
};



//$.Player.fuelUsage = function () {
//
//
//};



$.Player.hit = function (hp) {

    if (!this.docked) {
        if (this.shield.total > 0) {
            this.shield.total -= hp;

            var particleEffect = new $.ParticleEmiter();
            particleEffect.init(this.x, this.y, 'shield', this);
            $.particleInstances.push(particleEffect);
            //$.sounds.shieldHit.play();

        } else {
            this.hull.total -= hp;

            if (this.hull.total <= 0){
                var particleEffect = new $.ParticleEmiter();
                particleEffect.init(this.x, this.y, 'explosion', this);
                $.particleInstances.push(particleEffect);
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.dead = true;
            }

        }
        $.UI.hit();
        //$.sounds.hullHit.play();

    }
};


$.shieldHit = function () {



};


$.Player.update = function () {

    if(!this.docked) {
        this.movement();
    }
    this.draw();
};



$.Player.draw = function () {

    if(!this.dead) {
        this.canvas.save();
        this.canvas.translate($.screenW/2, $.screenH/2);
        this.canvas.rotate(this.rotation);

        for (var vector in this.shipSVG) {
            this.canvas.fillStyle = this.shipSVG[vector].colour;
            this.canvas.fill(this.shipSVG[vector].shape);
        }

        this.canvas.restore();
    }

};
