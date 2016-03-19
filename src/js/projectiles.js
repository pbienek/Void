$.Projectiles = function () {};

$.Projectiles.init = function () {
    this.canvas  = $.projectilesCanvas;
    this.bullets = [];
};


$.Projectiles.add = function (angle, origin, speed, colour, width, height, hp) {


    var bullet = {
        width  : width,
        height : height,
        x      : origin.x,
        y      : origin.y,
        origin : origin,
        angle  : angle,
        speed  : speed,
        vel    : { x : origin.velX, y : origin.velY },
        colour : colour,
        hp     : hp,
        owner  : 'player',
        rotation : angle,
        spawnTime : $.gameTime
    };

    this.bullets.push(bullet);
};


$.Projectiles.process = function (bullet, pos) {
    bullet.x += ((bullet.speed* Math.cos(bullet.angle)) + (bullet.vel.x));
    bullet.y += ((bullet.speed* Math.sin(bullet.angle)) + (bullet.vel.y));

    this.drawX = ($.Universe.offsetX + bullet.x);
    this.drawY = ($.Universe.offsetY + bullet.y);

    if (($.gameTime - bullet.spawnTime) > 50) {
        this.deleteMe(pos);
    } else {
        this.hitCheck(bullet, pos);
        this.draw(this.drawX, this.drawY, bullet.colour, bullet.width, bullet.height,  bullet.rotation);
    }
};



$.Projectiles.deleteMe = function (pos) {
    this.bullets.splice(pos, 1);
};



$.Projectiles.hitCheck = function (bullet, pos) {

    var i = $.Universe.ships.length;
    while (i--) {
        var object = {
            width  : $.Universe.ships[i].width,
            height : $.Universe.ships[i].height,
            x      : $.Universe.ships[i].x,
            y      : $.Universe.ships[i].y
        };

        if (bullet.origin.faction !== $.Universe.ships[i].faction) {
            if (intersectionCheck(bullet, object) && $.Universe.ships[i].faction !== bullet.origin.faction) {
                $.Universe.ships[i].hit(bullet.hp);
                this.deleteMe(pos);
            }
        }
    }

    if (bullet.origin.faction !== 'player') {
        if (intersectionCheck(bullet, $.Player)) {
            $.Player.hit(bullet.hp, bullet.origin.id);
            this.deleteMe(pos);
        }
    }
};


$.Projectiles.casualUpdate = function () {


    //var s = $.Universe.ships.length;
    //while (s--) {
    //
    //    if () {
    //
    //    }
    //
    //}

};


$.Projectiles.update = function () {
    var i = this.bullets.length;
    while (i--) {
        this.process(this.bullets[i], i);
    }
};


$.Projectiles.draw = function (x, y, colour, width, height, rotation) {


    var gradient = this.canvas.createLinearGradient(0,0,width,0);
    gradient.addColorStop(0,'rgba(' + colour + ',0)');
    gradient.addColorStop(1,'rgba(' + colour + ',1)');


    this.canvas.save();
    this.canvas.translate(x, y);
    this.canvas.rotate(rotation);

    this.canvas.beginPath();
    this.canvas.rect(0, 0, width, height);
    this.canvas.fillStyle = gradient;//'#df58eb';
    this.canvas.fill();

    this.canvas.rotate(1 * (-1));
    this.canvas.translate(x * (-1), y * (-1));
    this.canvas.restore();

};

