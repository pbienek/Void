$.UI = function () {};


$.UI.init = function () {
    var uiElement  = document.getElementById('ship-map');
    this.mapCanvas = uiElement.getContext('2d');
    this.mapCanvas.imageSmoothingEnabled = true;

    this.playerPos   = {x:0,y:0};
    this.messageIsOpen     = false;
    this.stationMenuIsOpen = false;
};



$.UI.plotMap = function () {

    var mapWidth = document.getElementById('ship-map').offsetWidth;
    var mapUnit  = $.Universe.width / mapWidth;


    //Plot player position
    this.playerPos.x = $.Player.x / mapUnit;
    this.playerPos.y = $.Player.y / mapUnit;
    this.mapCanvas.clearRect(0, 0, mapWidth, mapWidth);


    //Plot station positions
    for(var i = 0; i < $.Universe.locations.length; i++) {

        if ($.Universe.locations[i].discovered || getDistance($.Player.x, $.Player.y, $.Universe.locations[i].x, $.Universe.locations[i].y) <= $.Player.radarRadius) {
            $.Universe.locations[i].discovered = true;

            var x = $.Universe.locations[i].x / mapUnit;
            var y = $.Universe.locations[i].y / mapUnit;

            this.mapCanvas.beginPath();
            this.mapCanvas.arc(x, y, 3, 0, 2 * Math.PI, false);
            this.mapCanvas.fillStyle = '#fff';
            this.mapCanvas.fill();
        }
    }


    //Plot Enemy positions
    for(var i = 0; i < $.Universe.ships.length; i++) {

        if(!$.Universe.ships[i].atHome && getDistance($.Player.x, $.Player.y, $.Universe.ships[i].x, $.Universe.ships[i].y) <= $.Player.radarRadius) {

            var x = $.Universe.ships[i].x / mapUnit;
            var y = $.Universe.ships[i].y / mapUnit;

            this.mapCanvas.beginPath();
            this.mapCanvas.arc(x, y, 2, 0, 2 * Math.PI, false);

            if($.Universe.ships[i].faction === 'outlaw'){
                this.mapCanvas.fillStyle = '#fa2444';
            } else {

                if ($.Universe.ships[i].type === 'police') {
                    this.mapCanvas.fillStyle = '#24cdeb';

                } else {
                    this.mapCanvas.fillStyle = '#a2a2a7';
                }
            }
            this.mapCanvas.fill();
        }
    }


    var radarSize = $.Player.radarRadius / mapUnit;

    this.mapCanvas.beginPath();
    this.mapCanvas.arc(this.playerPos.x, this.playerPos.y, radarSize, 0, radarSize * Math.PI, false);
    this.mapCanvas.fillStyle = 'rgba(79, 253, 138,0.1)';
    this.mapCanvas.fill();
    this.mapCanvas.beginPath();
    this.mapCanvas.arc(this.playerPos.x, this.playerPos.y, 2, 0, 2 * Math.PI, false);
    this.mapCanvas.fillStyle = '#4FFD8A';
    this.mapCanvas.fill();

};

$.UI.statusBars = function () {
    var fuelPercent = ($.Player.fuel.total / $.Player.fuel.capacity) * 100;
    document.querySelector('.fuel .bar .remaining').style.width = fuelPercent+'%';

    var shieldPercent = ($.Player.shield.total / $.Player.shield.capacity) * 100;
    document.querySelector('.shields .bar .remaining').style.width = shieldPercent+'%';

    var hullPercent = ($.Player.hull.total / $.Player.shield.capacity) * 100;
    document.querySelector('.hull .bar .remaining').style.width = hullPercent+'%';
};


$.UI.showMessage = function (text) {

    if (!this.messageIsOpen) {
        var dialog = document.getElementById('message');
        dialog.innerHTML = text;
        dialog.className = 'open';

        this.messageIsOpen = true;
    }
};

$.UI.closeMessage = function () {

    if (this.messageIsOpen) {
        var dialog = document.getElementById('message');
        dialog.innerHTML = '';
        dialog.className = '';

        this.messageIsOpen = false;
    }
};


$.UI.handleTabs = function(page) {

    var tabs = document.querySelectorAll('.tab');
    var t = tabs.length;
    while (t--) {
        tabs[t].className = 'tab';
    }

    var pages = document.querySelectorAll('.warez');
    var p = pages.length;
    while (p--) {
        pages[p].className = 'warez';
    }

    document.getElementById(page+'Tab').className = 'tab active';
    document.getElementById(page).className       = 'warez active';
};


$.UI.showStationMenu = function (station) {
    this.closeMessage();

    this.stationMenuIsOpen = true;
    var menu = document.getElementById('station-menu');
    var title = menu.getElementsByClassName('station-title')[0];
    title.innerHTML = station.name;

    document.getElementById('credits').innerHTML = $.Player.credits.toFixed(2);


    //POPULATE MARKET STOCK
    this.render();


    menu.className = 'game-menu open';
    this.messageIsOpen = false;

};
$.UI.render = function () {
    this.renderMarketTable();
    this.renderInventoryTable();
    this.renderServices();
    this.renderUpgrades();
};


$.UI.renderMarketTable = function () {
    var station = $.Player.closestStation;

    var warezTable = document.getElementById('market_stock');
    warezTable.innerHTML = "";
    for (var name in station.stock) {

        var rowCount = warezTable.rows.length;
        var row = warezTable.insertRow(rowCount);
        row.className = name.replace(/\\/g, '');
        var canBuy = '';

        if ($.Player.credits >= station.stock[name].price && station.stock[name].qnt > 0) {
            canBuy = 'class="button" onclick="$.UI.buyItem(\'' + name + '\')"';
        } else {
            canBuy = 'class="button disable"';
        }

        row.insertCell(0).innerHTML = station.stock[name].qnt;
        row.insertCell(1).innerHTML = name;
        row.insertCell(2).innerHTML = station.stock[name].description;
        row.insertCell(3).innerHTML = station.stock[name].price + '<span class="lwrC">c</span>';
        row.insertCell(4).innerHTML = '<button '+ canBuy +'>BUY</button>';
    }
};

$.UI.renderInventoryTable = function () {
    var station = $.Player.closestStation;
    var warezTable = document.getElementById('cargobay');
    warezTable.innerHTML = "";
    for (var name in $.Player.cargoBay) {

        var rowCount = warezTable.rows.length;
        var row = warezTable.insertRow(rowCount);
        row.className = name.replace(/\\/g, '');
        var canSell   = '';
        var profit    = 0;

        if ($.Player.cargoBay[name].qnt > 0) {
            profit = (station.stock[name].price - $.Player.cargoBay[name].avgPrice);
            canSell = 'class="button" onclick="$.UI.sellItem(\'' + name + '\')"';
        } else {
            canSell = 'class="button disable"';
        }

        row.insertCell(0).innerHTML = $.Player.cargoBay[name].qnt;
        row.insertCell(1).innerHTML = name;
        row.insertCell(2).innerHTML = $.Player.cargoBay[name].netValue + '<span class="lwrC">c<span></span>';
        row.insertCell(3).innerHTML = station.stock[name].price + '<span class="lwrC">c<span></span>';
        row.insertCell(4).innerHTML = profit.toFixed(2) + '<span class="lwrC">c<span></span>';
        row.insertCell(5).innerHTML = '<button ' + canSell + '">SELL</button>';
    }
};


$.UI.renderServices = function () {

    document.querySelector('#hull .amount').innerHTML = 0;
    document.querySelector('#fuel .amount').innerHTML = 0;

    var hullElm = document.getElementById('hull_slider');
    hullElm.setAttribute('max',0);


    var maxHuSpace   = ($.Player.hull.capacity - $.Player.hull.total);
    var maxHuAfford = $.Player.credits / 1;
    if (maxHuAfford < maxHuSpace){
        maxHuSpace = maxHuAfford;
    }

    if(maxHuSpace >= 1) {
        hullElm.setAttribute('max', maxHuSpace);
        hullElm.removeAttribute('disabled');
        document.querySelector('#hull .button').className = 'button'
    } else {
        hullElm.setAttribute('disabled', 'true');
        document.querySelector('#hull .button').className = 'button disable';
    }

    var fuelElm = document.getElementById('fuel_slider');
    fuelElm.setAttribute('max',0);

    var maxFuSpace   = ($.Player.fuel.capacity - $.Player.fuel.total);
    var maxFuAfford = $.Player.credits / 0.3;
    if (maxFuAfford < maxFuSpace){
        maxFuSpace = maxFuAfford;
    }

    if(maxFuSpace >= 1) {
        fuelElm.setAttribute('max', maxFuSpace);
        fuelElm.removeAttribute('disabled');
        document.querySelector('#fuel .button').className = 'button'
    } else {
        fuelElm.setAttribute('disabled', 'true');
        document.querySelector('#fuel .button').className = 'button disable';
    }

};

$.UI.renderUpgrades = function () {

    document.getElementById('credits').innerHTML = $.Player.credits.toFixed(2);

    var warezTable = document.getElementById('upgrades_table');
    warezTable.innerHTML = "";
    for (var name in $.Upgrades) {


        var rowCount = warezTable.rows.length;
        var row = warezTable.insertRow(rowCount);
        var canBuy = '';
        var currentLevel = $.Upgrades[name].currentLevel;

        var price = $.Upgrades[name].levels['level'+(currentLevel+1)].price;

        var levelsHTML = '';

        for (var lvl = 1; lvl <= 5; lvl++) {

            if (currentLevel < lvl) {
                levelsHTML += '<div class="level"></div>';
            } else {
                levelsHTML += '<div class="level acquired"></div>';
            }

        }


        if ($.Player.credits >= price) {
            canBuy = 'class="button" onclick="$.UI.buyUpgrade(\'' + name + '\')"';
        } else {
            canBuy = 'class="button disable"';
        }


        row.insertCell(0).innerHTML = name;
        row.insertCell(1).innerHTML = $.Upgrades[name].description;
        row.insertCell(2).innerHTML = levelsHTML;
        row.insertCell(3).innerHTML = price + '<span class="lwrC">c</span>';
        row.insertCell(4).innerHTML = '<button '+ canBuy +'>BUY</button>';
    }

};


$.UI.buyUpgrade = function (name) {

    $.Upgrades[name].currentLevel++;
    var currentLevel = $.Upgrades[name].currentLevel;
    var price = $.Upgrades[name].levels['level'+currentLevel].price;
    var upgrade = $.Upgrades[name].levels['level'+currentLevel];

    if(name === 'hull' || name === 'shield') {
        $.Player[name].capacity = upgrade.total;
        $.Player[name].total    = upgrade.total;
    }

    if(name === 'shield'){
        $.Player[name].regenerationRate = upgrade.regenerationRate;
    }

    if (name === 'engine') {
        $.Player.topSpeed     = upgrade.topSpeed;
        $.Player.acceleration = upgrade.acceleration;
    }

    if (name === 'laser') {
        $.Player.laser.coolDown = upgrade.coolDown;
        $.Player.laser.hp       = upgrade.hp;
        $.Player.laser.speed    = upgrade.speed;
        $.Player.laser.width    = upgrade.width;
        $.Player.laser.height   = upgrade.height;
    }
    if (name === 'radar') {
        this.radarRadius = upgrade.radius;
    }

    $.Player.credits -= price;
    this.render();


};



$.UI.buyItem = function (item) {

    $.Player.closestStation.buyItem(item,$.Player);

    document.getElementById('credits').innerHTML = $.Player.credits.toFixed(2);
    this.render();
};


$.UI.sellItem = function (item) {

    $.Player.closestStation.sellItem(item, $.Player);

    document.getElementById('credits').innerHTML = $.Player.credits.toFixed(2);
    this.render();
};

$.UI.buyService = function (item) {

    var amount = document.getElementById(item+'_slider').value;
    $.Player.closestStation.buyService(item, $.Player, amount);
    document.getElementById('credits').innerHTML = $.Player.credits.toFixed(2);
    this.render();
};

$.UI.servicesRange = function (item) {
    var value   = document.getElementById(item+'_slider').value;
    var cost = $.Player.closestStation.services[item].cost;
    var amount = (value * cost).toFixed(2) + '<span class="lwrC">c</span>';
    document.querySelector('#' + item + ' .amount').innerHTML = amount;
};


$.UI.closeStationMenu = function () {
    this.stationMenuIsOpen = false;
    var menu = document.getElementById('station-menu');
    menu.className = 'game-menu';

    var warezTable = document.getElementById('market_stock');
    warezTable.innerHTML = "";

    //document.querySelector(".exit-button").removeEventListener("click", myFunction);

    $.Player.undock();
};

$.UI.startGame = function () {
    $.paused = false;
    document.getElementById('start-screen').className = 'game-menu';

};

//
//$.UI.showPauseMenu = function () {
//    $.paused = true;
//    $.UI.showMessage('GAME PAUSED')
//};
//
//
//$.UI.closePauseMenu = function () {
//    $.paused = false;
//
//    var menu  = document.getElementById('pause-menu');
//    menu.className = 'game-menu';
//
//};





$.UI.hit = function() {

    var container = document.getElementById('game-container');
    container.className = 'canvas-wrap shake';
    setTimeout(function(){
        container.className = 'canvas-wrap';
    },50)

};


$.UI.update = function () {
    this.plotMap();
    $.UI.statusBars();
};










