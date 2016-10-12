var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del'),
    ngannotate = require('gulp-ng-annotate'),
    debug = require('gulp-debug');

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'imagemin','copyfonts', 'copyviews');
});

gulp.task('usemin',['jshint'], function () {
    return gulp.src('./app/**/*.html')
        .pipe(usemin({
            css:[minifycss(),rev()],
            js: [ngannotate(),uglify(),rev()]
        }))
        .pipe(gulp.dest('dist/'));
});


// Images
gulp.task('imagemin', function() {
    return del(['dist/images']), gulp.src('app/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', function() {
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

// copy views
gulp.task(
    'copyviews', function () {
        return del(['dist/views']), gulp.src('app/views/**/*.html')
            .pipe(gulp.dest('./dist/views'));
    }
);

gulp.task(
    'move', function () {
        return del(['app/json-server/public']), gulp.src('dist/**/*.*')
            .pipe(debug({title: 'unicorn:'}))
            .pipe(gulp.dest('json-server/public'))
    }
);

// Watch
gulp.task('watch', ['browser-sync'], function() {
    // Watch .js files
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});
