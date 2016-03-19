$.Ship = function () {};

$.Ship.prototype = {

    init : function (home) {
        this.id = Math.floor(Math.random() * 1000000);

        this.canvas = $.shipsCanvas;

        this.x = Math.floor(Math.random() * $.Universe.width)  + 1 || 0;
        this.y = Math.floor(Math.random() * $.Universe.height) + 1 || 0;


        //  POSITIONAL & PHYSICS
        this.velocity        = {x : 0, y : 0};
        this.topSpeed        = 0;
        this.friction        = 0;
        this.acceleration    = 0;
        this.mass            = 50;

        this.desiredRotation = 0;
        this.rotation        = 0;
        this.home     = home;
        this.potentialThreats = [];
        this.lastHit = 0;

        this.targetDestination = {
            x : 0,
            y : 0,
            velocity : {
                x : 0,
                y : 0
            },
            distance : 0,
            stoppingDistance : 250
        };
        this.fleeTarget = {
            x : 0,
            y : 0,
            velocity : {
                x : 0,
                y : 0
            },
            distance : 0,
            stoppingDistance : 250
        };


        this.hitList = {};


        // SHIP ATTRIBUTES
        this.hull   = {capacity: 1000, total: 1000};
        this.shield = {capacity: 200, total: 200, regenerationRate : 0.1};
        this.fuel   = {capacity: 1000, total: 1000};

        this.station = {};
        this.dockingRange   = false;
        this.docked         = false;
        this.finishedTrade  = false;
        this.timeDocked     = 0;
        this.dockDuration   = 50;
        this.bounty         = 0;
        this.mode           = 'seek';
        this.firedAtBy      = '';

        this.closeObjects = [];

        this.create();

    },



    movement : function () {


        var desiredVelocity  = {};
        var steeringVelocity = {
            x : 0,
            y : 0
        };

        var logged = null;

        var seek = function (target) {

            var dist = {
                x : target.x - this.x,
                y : target.y - this.y
            };
            dist = normalize(dist);

            target.distance      = getDistance(this.x, this.y, target.x, target.y) - target.stoppingDistance;
            var relativeSpeed    = Math.sqrt((this.velocity.x*this.velocity.x) + (this.velocity.y*this.velocity.y));
            var stoppingDistance = (relativeSpeed/this.acceleration) * relativeSpeed * 0.5;

            if (stoppingDistance >= target.distance) {

                desiredVelocity = {
                    x : dist.x * (this.topSpeed * (target.distance / stoppingDistance)),
                    y : dist.y * (this.topSpeed * (target.distance / stoppingDistance))
                };

                if (this.targetDestination.distance <= 1) {
                    desiredVelocity = {
                        x : 0,
                        y : 0
                    };
                }

            } else {

                desiredVelocity = {
                    x : dist.x * this.topSpeed,
                    y : dist.y * this.topSpeed
                };
            }

        }.bind(this);



        var flee = function (target) {

            var dist = {
                x : this.x - target.x,
                y : this.y - target.y
            };
            dist = normalize(dist);

            desiredVelocity = {
                x : dist.x * this.topSpeed,
                y : dist.y * this.topSpeed
            };


        }.bind(this);


        //
        //var pursuit = function (target) {
        //
        //    var distance = getDistance(this.x, this.y, target.x, target.y);
        //    var updatesAhead = distance / this.topSpeed;
        //    var futurePosition = {
        //        x : (target.x + target.velocity.x * updatesAhead),
        //        y : (target.y + target.velocity.y * updatesAhead)
        //    };
        //
        //    seek(futurePosition);
        //}.bind(this);


        //var evade = function (target) {
        //    var distance       = getDistance(this.x, this.y, target.x, target.y);
        //    var updatesAhead   = distance.length / this.topSpeed;
        //    var futurePosition = {
        //        x : (target.x + target.velocity.x * updatesAhead),
        //        y : (target.y + target.velocity.y * updatesAhead)
        //    };
        //
        //    flee(futurePosition);
        //}.bind(this);




        var collisionAvoidance = function () {

            var maxAvoidAhead = 100,
                maxForce      = 5.4,
                avoidForce    = 10;

            var tmpVel  = {
                x : this.velocity.x,
                y : this.velocity.y
            };
            var normVel = normalize(tmpVel);



            var tv = {
                x : this.velocity.x,
                y : this.velocity.y
            };

            tv = normalize(tv);
            tv = {
                x : tv.x * (maxAvoidAhead * 0.5 * 2 / this.topSpeed),
                y : tv.y * (maxAvoidAhead * 0.5 * 2 / this.topSpeed)
            };

            var dynamic_length = (this.velocity.x + this.velocity.y) / this.topSpeed;

            var ahead  = {
                x : (this.x + normVel.x * dynamic_length ),
                y : (this.y + normVel.y * dynamic_length )
            };


            //var dynamic_length = 2 / this.topSpeed;
            //
            //var ahead  = {
            //    x : (this.x + normVel.x * dynamic_length),
            //    y : (this.y + normVel.y * dynamic_length)
            //};


            var lineIntersectsCircle = function (obstacle){

                var ahead2  = {
                    x : (this.x + normVel.x * maxAvoidAhead * 0.5),
                    y : (this.y + normVel.y * maxAvoidAhead * 0.5)
                };

                return  (getDistance(obstacle.x, obstacle.y, ahead.x, ahead.y) <= obstacle.size || getDistance(obstacle.x, obstacle.y, ahead2.x, ahead2.y) <= obstacle.size || getDistance(obstacle.x, obstacle.y, this.x, this.y) <= obstacle.size);
            }.bind(this);


            var findMostThreateningObstacle = function () {
                var mostThreatening = null;

                var obstacles = $.Universe.locations.concat($.Universe.ships);


                for (var i = 0; i < obstacles.length; i++) {
                    var obstacle  = obstacles[i];
                    var collision = lineIntersectsCircle(obstacle);

                    // "position" is the character's current position
                    if (collision && (mostThreatening == null || getDistance(this.x, this.y, obstacle.x, obstacle.y) < getDistance(this.x, this.y, mostThreatening.x, mostThreatening.y))) {
                        mostThreatening = obstacle;
                    }
                }

                return mostThreatening;

            }.bind(this);



            var mostThreatening  = findMostThreateningObstacle();
            var avoidance  = {x : 0, y : 0};

            if (mostThreatening != null) {
                avoidance.x = ahead.x - mostThreatening.center.x;
                avoidance.y = ahead.y - mostThreatening.center.y;

                avoidance = normalize(avoidance);
                avoidance = {
                    x : avoidance.x * avoidForce,
                    y : avoidance.y * avoidForce
                }
            } else {
                avoidance = {
                    x : 0,
                    y : 0
                };
            }

            if (!isNaN(avoidance.x) || !isNaN(avoidance.y)) {
                return avoidance;
            } else {
                return {
                    x : 0,
                    y : 0
                };
            }



        }.bind(this);


        var separationDetection = function () {

            var force = {x : 0, y : 0};
            var separationRadius = 80;
            var neighbourCount = 0;
            var maxSeparation = 5;

            for (var i = 0; i < this.closeObjects.length; i++) {
                var object = this.closeObjects[i];

                if (object.id != this.id && getDistance(object.x, object.y, this.x, this.y) <= separationRadius) {
                    force.x += object.x - this.x;
                    force.y += object.y - this.y;

                    neighbourCount++;
                }
            }

            if (neighbourCount != 0) {
                force.x /= neighbourCount;
                force.y /= neighbourCount;
                force.x *=  -1;
                force.y *=  -1;


                force = normalize(force);

                force.x *= maxSeparation;
                force.y *= maxSeparation;

            }

            return force;

        }.bind(this);



        if (this.mode === 'seek') {
            seek(this.targetDestination);
        }

        if (this.mode === 'flee') {

            flee(this.targetDestination);
        }

        if (this.mode === 'pursuit') {
            seek(this.targetDestination);
        }

        if (this.mode === 'evade') {
            evade(this.targetDestination);
        }





        var avoidance = collisionAvoidance();
        var separation = separationDetection();




        steeringVelocity = {
            x : desiredVelocity.x - this.velocity.x + avoidance.x + separation.x,
            y : desiredVelocity.y - this.velocity.y + avoidance.y + separation.y
        };


        if(steeringVelocity.x !== 0 && steeringVelocity.y !== 0) {
            steeringVelocity   = truncate(steeringVelocity, this.acceleration);
            steeringVelocity.x = steeringVelocity.x / this.mass;
            steeringVelocity.y = steeringVelocity.y / this.mass;
        }

        var tmpVelocity = {
            x : this.velocity.x + steeringVelocity.x,
            y : this.velocity.y + steeringVelocity.y
        };


        tmpVelocity = truncate(tmpVelocity, this.acceleration);
        this.velocity.x = tmpVelocity.x;
        this.velocity.y = tmpVelocity.y;



        if(!this.docked) {

            this.x += this.velocity.x;
            this.y += this.velocity.y;

            var getDesiredRotation = function ()  {

                var xDistance   = this.targetDestination.x - (this.x),
                    yDistance   = this.targetDestination.y - (this.y),
                    radians     = Math.atan2(yDistance, xDistance);

                return (radians);
            }.bind(this);

            this.rotation = getDesiredRotation();
            //if (Math.abs(this.desiredRotation-this.rotation) > 0.01) {


            //    if (this.desiredRotation-this.rotation > this.rotation) {
            //        this.rotation += 0.1;
            //    }
            //    if (this.desiredRotation-this.rotation < this.rotation) {
            //        this.rotation -= 0.1;
            //    }
            //}

        }
        //if (isNaN(this.x) || isNaN(this.y)) {
        //    console.log(logged)
        //    this.rotation = 0;
        //
        //    this.die();
        //    console.log('killed due to NaN error')
        //}






    },


    combatMode : function () {

        if (this.potentialThreats.length > 0){
            this.fleeTarget.x = this.potentialThreats[0].x;
            this.fleeTarget.y = this.potentialThreats[0].y;
            this.fleeTarget.velocity.x = this.potentialThreats[0].velocity.x;
            this.fleeTarget.velocity.y = this.potentialThreats[0].velocity.y;
            this.mode = 'flee'
        } else {
            this.mode = 'seek';
            this.targetDestination.x = this.potentialTargets[0].x;
            this.targetDestination.y = this.potentialTargets[0].y;
            this.targetDestination.velocity.x = this.potentialTargets[0].velocity.x;
            this.targetDestination.velocity.y = this.potentialTargets[0].velocity.y;

            if (this.targetDestination.distance <= this.fireRange) {
                this.fireAtTarget();
            }
        }
    },



    hit : function (hp, id) {

        if(!this.docked) {

            if (this.shield.total > 0) {
                this.shield.total -= hp;
            } else {
                this.hull.total -= hp;
            }

            var particleEffect = new $.ParticleEmiter();
            particleEffect.init(this.x, this.y, 'shield', this);
            $.particleInstances.push(particleEffect);

            this.hitList[id]++;
            this.firedAtBy = id;
            this.lastHit = $.gameTime;
        }



        if (this.hull.total <= 0) {
            this.die();
        }
    },



    die : function () {

        var i = $.Universe.ships.length;
        while (i--) {
            if ($.Universe.ships[i].id === this.id) {
                $.Universe.ships.splice(i, 1);
            }
        }

        if (this.type === 'police') {
            this.home.fuzzShipsCount--;
        }
        if (this.type === 'cargo ship') {
            this.home.tradeShipsCount--;
        }
        if (this.type === 'pirate') {
            $.Universe.pirateShipCount--;
        }


        var particleEffect = new $.ParticleEmiter();
        particleEffect.init(this.x, this.y, 'explosion', this);
        $.particleInstances.push(particleEffect);

        delete this;

    },


    update : function () {
        this.drawX = ($.Universe.offsetX + this.x);
        this.drawY = ($.Universe.offsetY + this.y);

        this.movement();
        //console.log(Math.sqrt((this.velocity.x*this.velocity.x) + (this.velocity.y*this.velocity.y)))

        this.draw();
    },


    casualUpdate : function () {

        this.ai();
        if (this.shield.total  <  this.shield.capacity && !this.dead) {
            this.shield.total += this.shield.regenerationRate;
        }
    },


    draw : function () {

        if (!this.atHome) {
            this.canvas.save();
            this.canvas.translate(this.drawX, this.drawY);
            this.canvas.rotate(this.rotation);


            for (var vector in this.shipSVG) {
                this.canvas.fillStyle = this.shipSVG[vector].colour;
                this.canvas.fill(this.shipSVG[vector].shape);
            }


            this.canvas.rotate(this.rotation * (-1));
            this.canvas.translate(this.drawX * (-1), this.drawY * (-1));
            this.canvas.restore();
        }


    }


};