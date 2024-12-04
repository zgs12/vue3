// 安装Gulp
// npm install --save-dev gulp gulp-cli

const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
 
// 编译 ES6 代码
gulp.task('babel', function () {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});
 
// 监视文件变化
gulp.task('watch', function () {
    gulp.watch('src/**/*.js', gulp.series('babel'));
});
 
// 默认任务
gulp.task('default', gulp.series('babel', 'watch'));
