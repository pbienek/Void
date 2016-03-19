$.Universe = function () {};



$.Universe.init = function () {

    this.canvas = $.universeCanvas;
    this.width  = 10000;
    this.height = 10000;
    this.offsetX = 0;
    this.offsetY = 0;


    this.locations = [];
    this.ships     = [];
    this.objects   = [];


    this.starLayerWidth  = $.screenW;
    this.starLayerHeight = $.screenH;
    this.starsLayers = [];

    this.spawnLocations(4);
    this.maxPirateShips  = 0;
    this.pirateShipCount = 0;


    //Create parallaxing layers


    //this.canvas = universeElement.getContext('2d');
    //this.canvas.imageSmoothingEnabled = true;

    //this.starsCanvas0 = universeElement.getContext('2d');
    //this.starsCanvas0.imageSmoothingEnabled = true;

    //this.starsCanvas1 = universeElement.getContext('2d');
    //this.starsCanvas1.imageSmoothingEnabled = true;

    //this.starsCanvas2 = universeElement.getContext('2d');
    //this.starsCanvas2.imageSmoothingEnabled = true;

    this.createStars();
};



$.Universe.spawnLocations = function (numOfLocations) {

    var spacing = ((this.width/numOfLocations) * 2);


    while (numOfLocations) {

        var x = Math.floor(Math.random() * $.Universe.width);
        var y = Math.floor(Math.random() * $.Universe.height);

        if (checkSpacing(x, y, this.locations, spacing)) {

            var station = new $.Location();
            station.init(x, y);
            this.locations.push(station);
            numOfLocations--;
        }
    }
};



$.Universe.spawnShips = function () {

    if(this.pirateShipCount < this.maxPirateShips) {
        var ship = new $.PirateShip();
        ship.init();
        this.ships.push(ship);
        this.pirateShipCount++;
    }
};



$.Universe.spawnAsteroids = function () {




};



$.Universe.createStars = function () {


    for (var i = 0; i < 3; i++){
        this.starsLayers.push(createLayer(i));
    }


    function createLayer (lyrNum) {

        var layer = [];


        for(var i = 0; i < 100; i++) {
            layer.push({
                radius : 1,
                brightness : getRandomNumFloat(0.1, 1),
                x : getRandomNum(0, $.Universe.starLayerWidth),
                y : getRandomNum(0, $.Universe.starLayerHeight),
                depth : getRandomNum(1, 10)
            });
        }

        return (layer);
    }
};



$.Universe.paintStars = function () {


    var l = this.starsLayers.length;
    while (l--) {

        var s = this.starsLayers[l].length;
        var canvas = 'starsCanvas'+l;

        while(s--){

            if (this.starsLayers[l][s].x < 0){
                this.starsLayers[l][s].x += $.screenW;
            }
            if (this.starsLayers[l][s].x > $.screenW){
                this.starsLayers[l][s].x -= $.screenW;
            }
            if (this.starsLayers[l][s].y < 0){
                this.starsLayers[l][s].y += $.screenH;
            }
            if (this.starsLayers[l][s].y > $.screenH){
                this.starsLayers[l][s].y -= $.screenH;
            }



            var x       = this.starsLayers[l][s].x -= ($.Player.velocity.x/(20 * (this.starsLayers[l][s].depth)));
            var y       = this.starsLayers[l][s].y -= ($.Player.velocity.y/(20 * (this.starsLayers[l][s].depth)));
            var size    = this.starsLayers[l][s].radius;
            var opacity = this.starsLayers[l][s].brightness;


            //this.canvas.save();
            //this.canvas.translate(drawX, drawY);
            this.canvas.beginPath();
            this.canvas.rect(x, y, size, size);
            this.canvas.fillStyle = 'rgba(255,255,255,' + opacity + ')';
            this.canvas.fill();
            //this.canvas.translate(drawX * (-1), drawY * (-1));
            //this.canvas.restore();

        }
    }
};



$.Universe.update = function () {

    this.offsetX = -($.Player.x - ($.screenW/2));
    this.offsetY = -($.Player.y - ($.screenH/2));

    for (var i = 0; i < this.locations.length; i++){
        this.locations[i].update();
    }
    for (var s = 0; s < this.ships.length; s++){
        this.ships[s].update();

    }

    this.draw();
};



$.Universe.casualUpdate = function () {
    for (var s = 0; s < this.ships.length; s++){
        this.ships[s].casualUpdate();
    }
    for (var l = 0; l < this.locations.length; l++){
        this.locations[l].casualUpdate();
    }

    this.spawnShips();
};



$.Universe.draw = function () {


    this.canvas.clearRect(0, 0, $.screenW, $.screenH);

    $.Universe.paintStars();


};