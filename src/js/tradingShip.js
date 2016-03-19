$.TradingShip = function () {
    $.Ship.call(this);
};

$.TradingShip.prototype = new $.Ship();

$.TradingShip.prototype.constructor = $.TradingShip;


$.TradingShip.prototype.create = function () {

    this.shipSVG  = cargoShip;
    this.width    = 120;
    this.height   = 60;
    this.radius = 80;

    this.targetRange  = 2000;
    this.topSpeed     = 5;
    this.acceleration = 0.05;
    this.faction      = 'tradeAlliance';
    this.type         = 'cargo ship';
    this.stationList  = [];
    this.credits      = 1000;
    this.cargoSpace   = 20;
    this.cargoBay     = {};
    this.x = this.home.x + 400;
    this.y = this.home.y + 400;


};


$.TradingShip.prototype.ai = function () {


    //this.closeObjects = findCloseObjects(this.x, this.y, 2000);
    //if(getDistance(this.x, this.y, $.Player.x, $.Player.y) <= 2000) {
    //    this.closeObjects.push($.Player);
    //}


    //Create list of trading locations sorted by distance
    var pickLocation = function () {
        if (this.stationList.length === 0) {

            for (var s in $.Universe.locations) {

                if($.Universe.locations[s].id !== this.station.id) {
                    this.stationList.push({
                        id : $.Universe.locations[s].id,
                        x  : $.Universe.locations[s].x,
                        y  : $.Universe.locations[s].y
                    });
                }
            }

            this.stationList.sort(function (a, b) {

                var aDistance = getDistance(this.x, this.y, a.x, a.y);
                var bDistance = getDistance(this.x, this.y, b.x, b.y);

                if (aDistance > bDistance) {
                    return 1;
                } else {
                    return -1;
                }
            }.bind(this));

            this.targetDestination.x = this.stationList[0].x;
            this.targetDestination.y = this.stationList[0].y;
            this.targetDestination.velocity.x = 0;
            this.targetDestination.velocity.y = 0;

        }
    }.bind(this);

    pickLocation();

    //Arrive and Dock at Station
    if (this.targetDestination.distance < 200 && this.targetDestination.distance > 0 && !this.docked) {
        this.dockingRange = true;
        this.docked       = true;
        this.station      = getStationByID(this.stationList[0].id);
        this.timeDocked   = $.gameTime;
        this.station.dockedShips++;
    }



    if (this.docked) {

        if (!this.finishedTrade) {

            this.tradeGoods();

        } else {

            if($.gameTime >= this.timeDocked + this.dockDuration) {

                //wait until pirates have left

                //pick new destination
                this.stationList.splice(0,1);
                pickLocation();
                this.targetDestination.x = this.stationList[0].x;
                this.targetDestination.y = this.stationList[0].y;
                this.targetDestination.velocity.x = 0;
                this.targetDestination.velocity.y = 0;

                //undock
                this.docked         = false;
                this.finishedTrade  = false;
                this.station.dockedShips--;
            }
        }
    }

};


$.TradingShip.prototype.tradeGoods = function () {

    var sold  = [];

    //Sell profitable items
    for (var item in this.cargoBay) {

        if (this.cargoBay[item].avgPrice < this.station.stock[item].price) {

            for (var i = 0; i < this.cargoBay[item].qnt; i++) {
                this.station.sellItem(item, this);
            }
            sold.push(item);
        }
    }


    //TODO Refuel and repair
    //var fuelVolume = this.fuel.capacity - this.fuel.total;
    //var hullDamage = this.hull.capacity - this.hull.total;

    //var fuelCost   = (fuelVolume * this.station.services.fuel.cost);
    //var repairCost = (fuelVolume * this.station.services.hull.cost);

    //Buy New items,  TODO buy items believed to be cheap
    var shouldPurchase = [];

    for (var item in this.station.stock) {
        if (sold.indexOf(item) === -1) {
            shouldPurchase.push(item);
        }
    }

    var lowestPrice = 10000000;
    for (var p = 0; p < shouldPurchase.length; p++) {
        if (this.station.stock[shouldPurchase[p]].price < lowestPrice) {
            lowestPrice = this.station.stock[shouldPurchase[p]].price;
        }
    }
    //var attempts = 0;
    while (this.credits >= lowestPrice) {
        var item = getRandomNum(0, (shouldPurchase.length-1));

        if (this.station.stock[shouldPurchase[item]].qnt > 0 ) {
            if (this.station.stock[shouldPurchase[item]].price <= this.credits) {
                this.station.buyItem(shouldPurchase[item], this);
            }
        } else {
            break;
        }
    }

    this.finishedTrade = true;
};




