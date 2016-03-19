var gulp         = require('gulp');
var minifyHTML   = require('gulp-minify-html');
var minifyCss    = require('gulp-minify-css');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var replace      = require('gulp-replace');
var fs           = require('fs');
var zip          = require('gulp-zip');


gulp.task('process-css', function () {

    gulp.src(['./src/css/main.css'])
        .pipe(concat('complete.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./src/css/'));

});



gulp.task('copy-images', function () {

    //gulp.src('./src/img/**/*.png').pipe(gulp.dest('./dist/img/'));

});



gulp.task('process-js', function () {

    gulp.src([
        './src/js/utils.js',
        './src/js/sfxr.js',
        './src/js/controls.js',
        './src/js/projectiles.js',
        './src/js/particles.js',
        './src/js/player.js',
        './src/js/warez.js',
        './src/js/location.js',
        './src/js/ship_svgs.js',
        './src/js/ship.js',
        './src/js/pirateShip.js',
        './src/js/tradingShip.js',
        './src/js/fuzzShip.js',
        './src/js/universe.js',
        './src/js/upgrades.js',
        './src/js/ui.js',
        './src/js/main.js'
    ])
        .pipe(concat('complete.js'))
        .pipe(uglify({mangle: true,
        compress: {
        sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
    }}))

        .pipe(gulp.dest('./src/js/'));

});



gulp.task('process-html', function () {

    gulp.src('./src/index.html')
    .pipe(replace(/<!--js_replace-->[\s\S]*?<!--js_replace_end-->/, function (s, filename) {
        var JS_MIN = fs.readFileSync('./src/js/complete.js', 'utf8');
        return '<script>' + JS_MIN + '</script>';
    }))
    .pipe(replace(/<!--css_replace-->[\s\S]*?<!--css_replace_end-->/, function (s, filename) {
        var CSS_MIN = fs.readFileSync('./src/css/complete.css', 'utf8');
        return '<style>' + CSS_MIN + '</style>';
    }))
    .pipe(minifyHTML())
    .pipe(replace('targetDestination', 'td'))
    .pipe(replace('universe',          'unv'))
    .pipe(replace('Universe',          'Unv'))
    .pipe(replace('Player',            'Pl'))
    .pipe(replace('player',            'pl'))
    .pipe(replace('acceleration',      'ac'))
    .pipe(replace('this.canvas',       'this.cs'))
    .pipe(replace('level',             'lv'))
    .pipe(replace('ui-elements',       'uie'))
    .pipe(replace('game-menu',         'gm'))
    .pipe(replace('particle',          'pa'))
    .pipe(replace('origin',            'or'))
    .pipe(replace('velocity',          've'))
    .pipe(replace('level',             'lv'))
    .pipe(replace('ship',              'sp'))
    .pipe(replace('location',          'ln'))
    //.pipe(replace('div',          'f'))
    //.pipe(replace('span',          'e'))
    .pipe(gulp.dest('./dist/'));

});



gulp.task('zip-all', function () {
    gulp.src('./dist/**/*.*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'));

});




gulp.task('default', ['process-css', 'copy-images', 'process-js', 'process-html', 'zip-all']);