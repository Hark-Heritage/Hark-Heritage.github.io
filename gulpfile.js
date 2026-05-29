const gulp        = require('gulp');

const { series }  = require('gulp');
const { watch }   = require('gulp');

const path        = require('path');
const pump        = require('pump');
const fs          = require('fs');
const del         = require('del');

const now = Date.now();

require('make-promises-safe');



/*------------------------------------------------------------------------------------------------*\
    FTP

    Note: this always uploads everything (with obvious exceptions) DELIBERATELY.
    This is because not everything is watched all the time, and I may make changes to unwatched
    files without thinking or remembering to upload them.
    This method ensures that the host will always have the latest files, including THIS.
\*------------------------------------------------------------------------------------------------*/
/*const ftp         = require( 'vinyl-ftp' );
const ftpcrd      = require('./ftpcrd.json');

var ftp_src = './';


// Upload files
function do_ftp(cb) {
    console.log('Running FTP. See gulpfile.js for details.');

    var conn = ftp.create( {
        host:     ftpcrd.host,
        user:     ftpcrd.user,
        password: ftpcrd.pass,
        parallel: 10
    } );

    pump([
        gulp.src([
            './**',
            '!./{node_modules,node_modules/**}',
            '!./{media,media/**}',
            '!ftpcrd.json'
        ], { base: '.', buffer: false }),
        conn.dest(ftpcrd.dest)
    ],
    cb);
}

exports.ftp = do_ftp;


*/
/*------------------------------------------------------------------------------------------------*\
    CSS
\*------------------------------------------------------------------------------------------------*/
//var css_base = './';
//var css_src  =  ['!node_modules', '!node_modules/**', css_base + '*.scss', css_base + '**/*.scss'];
var css_src  =  './';
var css_dest = './css/';

const sass   = require('gulp-sass')(require('sass'));
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');


// Empty the CSS folder.
function empty_css_output(cb) {
    del.sync([css_dest + '*.*']);
    cb();
}


// Compile SCSS in expanded mode so it's easier to inspect the result.
//'!./{bower_components,bower_components/**,node_modules,node_modules/**}'
/*
// Compile SCSS in expanded mode so it's easier to inspect the result.
function do_sass(cb) {
    console.log('Running sass...');

    pump([
        gulp.src(css_src + '** /*.scss'),
        sass({outputStyle: 'expanded'}),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}
*/

function do_sass(cb) {
    console.log('Running sass...');

    pump([
        gulp.src([
            './_styles/**/*.scss'
        ], {base: process.cwd()}),
        sass({outputStyle: 'expanded'}),
        /*rename((path) => {
            path.dirname += "/css";
        }),*/
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}


/*
// Then create a minified version in the output folder.
function do_cssmin(cb) {
    console.log('Running cssmin...');

    var now = Date.now();

    pump([
        gulp.src(css_src + '** /*.css'),
        cssmin(),
        rename({extname: '.min.css'}),
        gulp.dest((file) => {
            //return css_dest;

            fs.writeFile('./_data/cache_bust_css.yml', 'date: ' + now, (err) => {
                if (err) throw err;
            });
            return css_dest;
        }),
        rename({suffix: '.' + now}),
        gulp.dest(css_dest)
    ],
    cb);
}
*/

// Then create a minified version in the output folder for the site, and cache-bust.
function do_cssmin(cb) {
    console.log('Running cssmin...');

    pump([
        gulp.src('./_styles/**/!(*.min)*.css'),
        cssmin(),
        rename({extname: '.min.css'}),
        gulp.dest((file) => {
            //return file.base;
            return css_dest;
        })
    ],
    cb);
}



// And the same for dev.
function do_devsass(cb) {
    console.log('Running devsass...');

    pump([
        gulp.src([
            './dev/**/*.scss',
            '!./dev/start-css/v1/**'
        ], {base: process.cwd()}),
        sass({outputStyle: 'expanded'}),
        rename((path) => {
            path.dirname += "/css";
        }),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}

// And create a minified version in the same folder for dev.
function do_devcssmin(cb) {
    console.log('Running devcssmin...');

    pump([
        gulp.src('./dev/**/!(*.min)*.css'),
        cssmin(),
        rename({extname: '.min.css'}),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}


exports.sass   = do_sass;
exports.cssmin = do_cssmin;

exports.devsass   = do_devsass;
exports.devcssmin = do_devcssmin;

exports.empty_css_output = empty_css_output;

// This combined task makes it convenient to run all the steps together.
//exports.css = series(empty_css_output, do_sass, do_cssmin);
exports.css = series(do_sass, do_cssmin);
exports.devcss = series(do_devsass, do_devcssmin);



/*------------------------------------------------------------------------------------------------*\
    JS
\*------------------------------------------------------------------------------------------------*/
//const js_src                 = './_scripts/';
const js_elementary_dest     = './dev/elementary/js/';
const js_elementary_filename = 'script.js';

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');


// Concat all JS files.
function do_concat_js(cb) {
    console.log('Running concat_js...');

    gulp.src([
        './dev/cookie-notice/cookie-notice-settings.js',
        './dev/cookie-notice/cookie-notice.js'
    ])
    .pipe(concat(js_elementary_filename))
    .pipe(gulp.dest(js_elementary_dest));

    // Callback:
    cb();
}

// And minify them.
function do_uglify(cb) {
    console.log('Running uglify...');

    pump([
        /*gulp.src([
            js_src + js_filename,
            js_src + js_map_filename,
            js_src + js_filter_filename
        ]),*/
        gulp.src([
            js_elementary_dest + js_elementary_filename
        ]),
        uglify(),
        rename({extname: '.min.js'}),
        gulp.dest(js_elementary_dest)
    ],
    cb);
}

exports.concat_js = do_concat_js;
exports.uglify    = do_uglify;

// This combined task makes it convenient to run all the steps together.
exports.js = series(do_concat_js, do_uglify);

exports.js_concat = do_concat_js;
exports.js_uglify = do_uglify;



/*------------------------------------------------------------------------------------------------*\
    WATCHERS
\*------------------------------------------------------------------------------------------------*/

// Watch CSS:
function do_watch_css(cb) {
    watch(css_src + '**/*.scss', exports.css);
}
exports.watch_css = do_watch_css;

function do_watch_devcss(cb) {
    watch(css_src + 'dev/**/*.scss', exports.devcss);
}
exports.watch_devcss = do_watch_devcss;


// Watch JS:
function do_watch_js(cb) {
    watch(js_src + '**/!(script|map)*.js', exports.js);
}
exports.watch_js = do_watch_js;


// Watch all of the above:
function do_watch_all(cb) {
    watch(css_src + '**/*.scss', exports.css);
    watch(css_src + 'dev/**/*.scss', exports.devcss);
    //watch(js_src + '** /!(script)*.js', exports.js);
}
exports.watch_all = do_watch_all;


// Watch FTP:
/*gulp.task('watch_ftp', function(){
    gulp.watch(ftp_src + '/** /*', ['ftp']);
});*/


// Watch PHP files:
/*gulp.task('watch_php', function(){
    gulp.watch('./** /*.php', ['ftp']);
});*/
