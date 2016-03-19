$.ParticleEmiter = function () {};

$.ParticleEmiter.prototype = {


    init : function (x, y, type, ship) {
        this.id     = Math.floor(Math.random() * 1000000);
        this.canvas = $.projectilesCanvas;
        this.type   = type;
        this.origin = {
            x : x,
            y : y,
            ship : ship || null
        };

        this.startTime = $.gameTime;
        this.particles = [];


        if (type === 'thrust') {
            this.generateThrust();
        }

        if (type === 'explosion') {
            this.generateExplosion();
        }

        if (type === 'shield') {
            this.generateShield();
        }

        //this.generateParticles();

    },


    generateExplosion : function () {

        this.duration  = 100;
        this.volume    = 80;

        var degree = (360/this.volume) * (180 / Math.PI);

        for (var i = 0; i < this.volume; i++) {

            var size  = (Math.floor(Math.random() * 10) + 2);
            var destX = Math.round(Math.random() * $.screenW + 1);
            var destY = Math.round(Math.random() * $.screenH + 1);

            degree = degree + getRandomNumFloat(-0.2, 0.2);

            this.particles.push({
                started      : false,
                x            : this.origin.x,
                y            : this.origin.y,
                vel          : { x : 0, y : 0 },
                acceleration : 0.2,
                friction     : 0.01,
                opacity      : 1,
                width        : getRandomNum(10, 90),
                height       : 1,
                colour       : 'rgba(255,255,255,1)',
                colourCode   : '255,255,255',
                angle        : (degree * i),
                rotation     : (degree * i),
                ship         : this.origin.ship,
                age          : 1

            });
        }

        setTimeout(function () {
            var i = $.particleInstances.length;
            while (i--) {
                if ($.particleInstances[i].id === this.id) {
                    $.particleInstances.splice(i, 1);
                }
            }
            delete this;
        }.bind(this), this.duration * 100);

    },


    updateExplosionParticle : function (particle) {

        var angle = particle.angle;
        var acceleration = (particle.acceleration * (particle.width / 8));
        particle.width = (particle.width);

        particle.opacity = (particle.opacity - (particle.age++/8000));
        particle.colour = 'rgba('+particle.colourCode+','+particle.opacity+')';

        particle.age++;

        particle.started = true;
        particle.vel.x = (acceleration * Math.cos(angle));
        particle.vel.y = (acceleration * Math.sin(angle));

        particle.x += particle.vel.x;
        particle.y += particle.vel.y;
    },


    drawExplosionParticle : function (particle) {

        var drawX = ($.Universe.offsetX + particle.x);
        var drawY = ($.Universe.offsetY + particle.y);

        this.canvas.save();
        this.canvas.translate(drawX, drawY);
        this.canvas.rotate(particle.rotation);

        this.canvas.beginPath();
        this.canvas.rect(0, 0, particle.width, particle.height);
        this.canvas.fillStyle = particle.colour;
        this.canvas.fill();

        this.canvas.rotate(particle.rotation * (-1));
        this.canvas.translate(drawX * (-1), drawY * (-1));
        this.canvas.restore();
    },


    generateThrust : function () {

        this.duration  = 3;
        this.volume    = 1;

        var size, destX, destY = 0;

        for (var i = 0; i < this.volume; i++) {

            size  = (Math.floor(Math.random() * 10) + 2);
            destX = Math.round(Math.random() * $.screenW + 1);
            destY = Math.round(Math.random() * $.screenH + 1);

            this.particles.push({
                started      : false,
                x            : this.origin.x -= (((this.origin.ship.width / 2)) * Math.cos(this.origin.ship.rotation)),
                y            : this.origin.y -= (((this.origin.ship.width / 2)) * Math.sin(this.origin.ship.rotation)),
                vel          : { x : 0, y : 0 },
                acceleration : 0.2,
                friction     : 0.01,
                opacity      : 1,
                size         : size,
                colour       : 'rgba(79, 253, 138,1)',
                colourCode   : '79, 253, 138',
                angle        : getRandomNumFloat((this.origin.ship.rotation - 0.5), (this.origin.ship.rotation + 0.5)),
                dest         : { x : destX, y : destY },
                rotation     : Math.atan2(getRandomNumFloat(0, 3), getRandomNumFloat(0, 3)),
                ship         : this.origin.ship,
                age          : 1

            });
        }

        setTimeout(function () {
            var i = $.particleInstances.length;
            while (i--) {
                if ($.particleInstances[i].id === this.id) {
                    $.particleInstances.splice(i, 1);
                }
            }
            delete this;
        }.bind(this), this.duration * 100);

    },


    updateThrustParticle : function (particle) {

        var angle = particle.angle;
        var acceleration = (particle.acceleration * (particle.size / 4));
        particle.size = (particle.age * 1);

        particle.opacity = (particle.opacity - (particle.age++/600));
        particle.colour = 'rgba('+particle.colourCode+','+particle.opacity+')';

        particle.age++;

        particle.started = true;
        particle.vel.x = (acceleration * Math.cos(angle));
        particle.vel.y = (acceleration * Math.sin(angle));

        particle.x += particle.vel.x;
        particle.y += particle.vel.y;
    },


    drawThrustParticle : function (particle) {

        var drawX = ($.Universe.offsetX + particle.x);
        var drawY = ($.Universe.offsetY + particle.y);

        this.canvas.save();
        this.canvas.translate(drawX, drawY);
        this.canvas.rotate(particle.rotation);

        this.canvas.beginPath();
        this.canvas.arc(0, 0, particle.size/2, 0, 2 * Math.PI, false);
        this.canvas.fillStyle = particle.colour;
        this.canvas.fill();

        this.canvas.rotate(particle.rotation * (-1));
        this.canvas.translate(drawX * (-1), drawY * (-1));
        this.canvas.restore();
    },





    generateShield : function () {

        this.duration  = 3;
        this.volume    = 1;
        var size       = 50;

        this.particles.push({
            started      : false,
            x            : this.origin.x,
            y            : this.origin.y,
            opacity      : 0.2,
            size         : this.origin.ship.width,
            colour       : 'rgba(93, 215, 255,0.15)',
            colourCode   : '93, 215, 255',
            ship         : this.origin.ship,
            age          : 1

        });


        setTimeout(function () {
            var i = $.particleInstances.length;
            while (i--) {
                if ($.particleInstances[i].id === this.id) {
                    $.particleInstances.splice(i, 1);
                }
            }
            delete this;
        }.bind(this), this.duration * 500);

    },
    updateShieldParticle : function (particle) {

        particle.opacity = (particle.opacity - 0.01);
        particle.colour = 'rgba('+particle.colourCode+','+particle.opacity+')';

        particle.age++;

        particle.started = true;

        particle.x = particle.ship.x;
        particle.y = particle.ship.y;
    },
    drawShieldParticle : function (particle) {

        var drawX = ($.Universe.offsetX + particle.x);
        var drawY = ($.Universe.offsetY + particle.y);

        this.canvas.save();
        this.canvas.translate(drawX, drawY);

        this.canvas.beginPath();
        this.canvas.arc(0, 0, particle.size, 0, 2 * Math.PI, false);
        this.canvas.fillStyle = particle.colour;
        this.canvas.fill();

        this.canvas.translate(drawX * (-1), drawY * (-1));
        this.canvas.restore();
    },







    update : function () {

        if (this.type === 'thrust') {
            var i = this.particles.length;
            while (i--) {
                this.updateThrustParticle(this.particles[i]);
                this.drawThrustParticle(this.particles[i]);
            }
        }
        if (this.type === 'explosion') {
            var i = this.particles.length;
            while (i--) {
                this.updateExplosionParticle(this.particles[i]);
                this.drawExplosionParticle(this.particles[i]);
            }
        }
        if (this.type === 'shield') {
            var i = this.particles.length;
            while (i--) {
                this.updateShieldParticle(this.particles[i]);
                this.drawShieldParticle(this.particles[i]);
            }
        }

    }

};


























