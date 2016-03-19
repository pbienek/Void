$.Location = function () {};

$.Location.prototype = {

    init : function (x, y) {

        this.id = Math.floor(Math.random() * 1000000);
        this.name = 'TERRAN STATION';
        this.canvas = $.objectsCanvas;
        this.x     = x;
        this.y     = y;
        this.radius = 200;
        this.size   = this.radius;
        this.center = {
            x : this.x + this.size,
            y : this.y + this.size
        };
        this.type = 'station';
        this.drawX = 0;
        this.drawY = 0;
        this.rotation = 0;
        this.discovered = false;
        this.shipSVG  = station;
        this.velocity = {x : 0, y : 0};
        this.stock = this.stockInventory();
        this.lastStockUpdate      = 0;
        this.stockUpdateFrequency = 600;
        this.dockedShips = 0;
        this.services = {
            fuel : {
                cost : 0.3
            },
            hull : {
                cost : 1
            }
        };

        this.credits = 10000;

        this.fuzzShipsCount  = 0;
        this.tradeShipsCount = 0;


    },


    spawnShips : function () {

        if (this.fuzzShipsCount === 0) {
            var fuzzShip = new $.FuzzShip();
            fuzzShip.init(this);
            $.Universe.ships.push(fuzzShip);
            this.fuzzShipsCount++;
        }

        if (this.tradeShipsCount === 0){
            var tradeShip = new $.TradingShip();
            tradeShip.init(this);
            $.Universe.ships.push(tradeShip);
            this.tradeShipsCount++;
        }
    },


    stockInventory : function () {

        var funds = 100000;
        var warezList = warezListGenerator();
        var warezLen = (warezList.length -1);
        var stock = {};

        var lowestPrice = 10000000;
        for (var i = 0; i < warezList.length; i++) {
            if (warezList[i].price < lowestPrice) {
                lowestPrice = warezList[i].price;
            }
        }

        while (funds >= lowestPrice) {
            var item = getRandomNum(0, warezLen);
            if (warezList[item].price <= funds) {
                addToStock(warezList[item]);
                funds -= warezList[item].price;
            }
        }


        function addToStock(item) {
            if(stock.hasOwnProperty(item.name)){
                stock[item.name].qnt++;
            } else {
                stock[item.name] = {
                    price : item.price,
                    rrp   : item.price,
                    qnt   : 1,
                    description : item.description
                }
            }
        }

        return stock;
    },


    updateStockPrices : function () {

        if($.gameTime >= this.lastStockUpdate + this.stockUpdateFrequency && this.dockedShips === 0){

            //console.log(this.stock)

            for (var item in this.stock) {

                var difUnit = (this.stock[item].rrp / 1000);
                var b = 50 - this.stock[item].qnt;

                this.stock[item].price = this.stock[item].rrp + Math.round(difUnit * b);
            }

            this.lastStockUpdate = $.gameTime;
        }
    },


    buyItem : function (item, ship) {

        if (ship.cargoBay.hasOwnProperty(item)) {
            ship.cargoBay[item].qnt++;
            ship.cargoBay[item].paidValues.push(this.stock[item].price);
            ship.cargoBay[item].netValue = 0;

            for (var i = 0; i < ship.cargoBay[item].paidValues.length; i++) {
                ship.cargoBay[item].netValue += ship.cargoBay[item].paidValues[i];
            }

            ship.cargoBay[item].avgPrice = (ship.cargoBay[item].netValue / ship.cargoBay[item].qnt) || 0;


        } else {
            ship.cargoBay[item] = {
                paidValues : [this.stock[item].price],
                netValue : this.stock[item].price,
                avgPrice : this.stock[item].price,
                name : item,
                qnt : 1,
                description: this.stock[item].description
            }
        }

        ship.credits -= this.stock[item].price;
        this.stock[item].qnt--;

        //this.updateStockPrices();
    },

    
    sellItem : function (item, ship) {

        this.stock[item].qnt++;
        ship.credits += this.stock[item].price;
        this.stock[item].qnt++;
        ship.cargoBay[item].qnt--;
        ship.cargoBay[item].paidValues.pop();

        ship.cargoBay[item].netValue = 0;

        for (var i = 0; i < ship.cargoBay[item].paidValues.length; i++) {
            ship.cargoBay[item].netValue += ship.cargoBay[item].paidValues[i];
        }

        ship.cargoBay[item].avgPrice = (ship.cargoBay[item].netValue / ship.cargoBay[item].qnt) || 0;

        //this.updateStockPrices();

    },
    


    
    buyService : function (service, ship, amount) {

        ship[service].total += parseInt(amount);
        ship.credits     -= (this.services[service].cost * amount);
        this.credits     += (this.services[service].cost * amount);
    
    },


    casualUpdate : function () {
        this.updateStockPrices();
        this.spawnShips();
    },


    update : function () {

        this.drawX = ($.Universe.offsetX + this.x);
        this.drawY = ($.Universe.offsetY + this.y);
        this.rotation += 0.002;
        this.draw();
    },


    draw : function () {

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

};