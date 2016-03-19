
/*************************|*************************
 *               KEYBOARD & MOUSE                  *
 *************************|*************************/
$.KM = function () {};


$.KM.prototype = {
    up        : null,
    down     : null,
    left      : null,
    right     : null,
    mousePos : 0
};


$.KM.init = function () {
    this.up             = false;
    this.down           = false;
    this.left           = false;
    this.right          = false;
    this.mousePos       = {};
    this.mouseDown      = false;
    this.leftMouseDown  = false;
    this.rightMouseDown = false;
    this.map        = {};


    window.addEventListener('keydown', this.getKey, false);
    window.addEventListener('keyup',   this.getKey, false);
    window.addEventListener('keypress',   function (e) {
        if(e.charCode == 112) {
            if(!$.paused){
                $.paused = true;
                $.UI.showMessage('GAME PAUSED');
            } else {
                $.UI.closeMessage();
                $.paused = false;
            }
        }
    }, false);
    window.addEventListener('mousemove', this.getMousePos, false);


    window.oncontextmenu = function ()  {
        return false;
    };


    window.addEventListener('mousedown', function (e) {
        this.mouseDown = true;

        if (e.which === 1) {
            this.leftMouseDown  = true;
        }
        if (e.which === 3){
            e.preventDefault();
            this.rightMouseDown = true;
        }

    }.bind(this), false);

    window.addEventListener('mouseup', function (e) {
        this.mouseDown = false;

        if (e.which === 1) {
            this.leftMouseDown  = false;
        }
        if (e.which === 3){
            e.preventDefault();
            this.rightMouseDown = false;
        }

    }.bind(this), false);

    document.getElementById("game-container").addEventListener('mousemove', function (e) {
        this.mousePos  = {
            x : e.offsetX || e.layerX,
            y : e.offsetY || e.layerY
        };

    }.bind(this));
};


$.KM.getKey = function (event) {

    var key = event.keyCode;

    // UP, DOWN, LEFT, RIGHT, SPACE, F
    if (key === 87 || key === 83 || key === 65 || key === 68 || key === 32 || key == 70 || key == 80 ) {
        $.KM.map[key] = (event.type == 'keydown');

    }
};



//
//$.KM.getMousePos = function (event) {
//
//    var elOffset = document.getElementById('player').getBoundingClientRect();
//
//    $.KM.mousePos = {
//        x : (event.x - elOffset.left),
//        y : (event.y - elOffset.top)
//    };
//};




