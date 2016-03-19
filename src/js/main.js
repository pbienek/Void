'use strict';


$.init = function () {

    this.resizeElements();


    // ADD CANVAS ELEMENTS TO DOCUMENT
    var playerElement      = document.getElementById('player'),
        objectsElement     = document.getElementById('objects'),
        shipsElement       = document.getElementById('ships'),
        particlesElement   = document.getElementById('particles'),
        projectilesElement = document.getElementById('projectiles'),
        universeElement    = document.getElementById('universe');


    $.playerCanvas  = playerElement.getContext('2d');
    $.playerCanvas.imageSmoothingEnabled = true;

    $.universeCanvas  = universeElement.getContext('2d');
    $.universeCanvas.imageSmoothingEnabled = true;

    $.objectsCanvas  = objectsElement.getContext('2d');
    $.objectsCanvas.imageSmoothingEnabled = true;


    $.shipsCanvas  = shipsElement.getContext('2d');
    $.shipsCanvas.imageSmoothingEnabled = true;

    $.particlesCanvas  = particlesElement.getContext('2d');
    $.particlesCanvas.imageSmoothingEnabled = true;

    $.projectilesCanvas  = projectilesElement.getContext('2d');
    $.projectilesCanvas.imageSmoothingEnabled = true;


    //$.sounds = {};
    //$.sounds.hullHit = new Audio();
    //$.sounds.hullHit.src = jsfxr([0,,0.1215,,0.09,0.5937,,-0.6261,,,,,,0.3953,,,-0.58,-0.72,0.82,,,0.1353,,0.55])
    //
    //$.sounds.shieldHit = new Audio();
    //$.sounds.shieldHit.src = jsfxr([0,,0.18,,,0.4,0.13,0.1999,0.5,0.34,0.72,,,0.0075,,,-0.06,0.94,0.07,0.8,,,0.6599,0.56])
    //
    //$.sounds.shipExplosion = new Audio();
    //$.sounds.shipExplosion.src = jsfxr([3,,0.32,0.19,0.455,0.092,,-0.36,-0.4399,,,0.54,0.7618,,,0.7794,0.291,-0.2852,1,,,,,0.56])
    //
    //$.sounds.laserFire = new Audio();
    //$.sounds.laserFire.src = jsfxr([0,,0.1148,,0.3815,0.8703,0.0552,-0.3912,,,,,,0.8922,-0.2317,,,,1,,,0.2016,,0.5])





    $.gameTime   = 0;
    $.renderTime = 0;
    $.score      = 0;
    $.paused     = true;


    $.particleInstances = [];

    // INITIATE CLASSES
    $.KM.init();
    $.Universe.init();
    $.Player.init();
    $.Projectiles.init();
    $.UI.init();


    var lastCalledTime;
    this.fps = 0;

    // RENDERING LOOP - Frame by frame actions go in here
    function animateMe() {
        if (!$.paused) {
            $.render();
            $.update();
        }
            requestAnimationFrame(animateMe);

            //$.renderTime++;

//            if(!lastCalledTime) {
//                lastCalledTime = Date.now();
//                fps = 0;
//                return;
//            }
//            var delta = (new Date().getTime() - lastCalledTime)/1000;
//            lastCalledTime = Date.now();
//            $.fps = 1/delta;

    }
    animateMe();


    // LESS TIME SENSITIVE LOOP
    setInterval(function () {

        if (!$.paused) {
            $.casualUpdate();
        }
    }, (100));
};


$.resizeElements = function () {
    //Resize Canvases
    $.screenW    = document.getElementById('game-container').offsetWidth;
    $.screenH    = document.getElementById('game-container').offsetHeight;
    var canvasLayers = document.querySelectorAll('.canvas_layer.main');
    var c = canvasLayers.length;
    while (c--) {
        canvasLayers[c].width = $.screenW;
        canvasLayers[c].height = $.screenH;
    }
};


$.casualUpdate = function () {

    this.gameTime++;
    $.Player.casualUpdate();
    $.UI.update();
    $.Universe.casualUpdate();


//    document.getElementById('fps').innerHTML = Math.round(this.fps);
};


$.update = function () {
// UPDATE WITH NEW
    $.Player.update();
    $.Universe.update();
    $.Projectiles.update();
};


$.render = function () {

    // CLEAR THE LAST SCENES
    $.playerCanvas.clearRect(0, 0, this.screenW, this.screenH);
    $.objectsCanvas.clearRect(0, 0, this.screenW, this.screenH);
    $.shipsCanvas.clearRect(0, 0, this.screenW, this.screenH);
    $.projectilesCanvas.clearRect(0, 0, this.screenW, this.screenH);

    var i = this.particleInstances.length;
    while (i--) {
        this.particleInstances[i].update();
    }

};


$.init();












