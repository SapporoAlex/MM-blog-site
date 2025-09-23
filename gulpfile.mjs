import { src, dest, watch, series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import terser from 'gulp-terser';
import plumber from 'gulp-plumber';

const sass = gulpSass(dartSass);

// Paths
const paths = {
  styles: { src: 'src/scss/**/*.scss', dest: 'dist/css/' },
  pages: { src: 'src/views/pages/**/*.ejs', dest: 'dist/' },
  partials: { src: 'src/views/partials/**/*.ejs' },
  scripts: { src: 'src/js/**/*.js', dest: 'dist/js/' }
};

// SCSS → CSS
export function stylesTask() {
  return src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(concat('style.css'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS → Minified
export function scriptsTask() {
  return src(paths.scripts.src)
    .pipe(plumber())
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// EJS pages → HTML
export function pagesTask() {
  return src(paths.pages.src)
    .pipe(plumber())
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(paths.pages.dest))
    .pipe(browserSync.stream());
}

// Watch + BrowserSync
export function watchTask() {
  browserSync.init({
    server: { baseDir: 'dist' },
    notify: false
  });

  watch(paths.styles.src, stylesTask);
  watch(paths.scripts.src, scriptsTask);
  watch(paths.pages.src, pagesTask);
  watch(paths.partials.src, pagesTask); // recompile pages if partials change
}

// Combined tasks
export const build = parallel(stylesTask, scriptsTask, pagesTask);
export const dev = series(build, watchTask);
export default dev;
