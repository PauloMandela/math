const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const htmlmin = require("gulp-htmlmin");
const livereload = require("gulp-livereload");
const fileinclude = require("gulp-file-include");
const browsersync = require("browser-sync").create();

// Clean static
function clear() {
  return src("./static/*", {
    read: false,
  }).pipe(clean());
}

// html function
function minify() {
  const source = "./src/*.html";

  return src(source)
    .pipe(changed(source))
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("./templates/"))
    .pipe(browsersync.stream());
}

// JS function
function js() {
  const source = "./src/js/*.js";

  return src(source)
    .pipe(changed(source))
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest("./static/js/"))
    .pipe(browsersync.stream());
}

//css
function css() {
  const source = "./src/css/*.css";
  return src(source)
    .pipe(changed(source))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 4 versions"],
        cascade: false,
      })
    )
    .pipe(cssnano())
    .pipe(dest("./static/css/"))
    .pipe(browsersync.stream());
}

function minjs() {
  const source = "./src/minjs/*.js";
  return src(source)
    .pipe(changed(source))
    .pipe(uglify())
    .pipe(dest("./static/js/"))
    .pipe(browsersync.stream());
}

// SCSS function
function scss() {
  const source = "./src/scss/main.scss";

  return src(source)
    .pipe(changed(source))
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 4 versions"],
        cascade: false,
      })
    )
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(cssnano())
    .pipe(dest("./static/css/"))
    .pipe(browsersync.stream());
}

// Optimize images
function img() {
  return src("./src/img/*")
        .pipe(imagemin())
        .pipe(dest("./static/img/"));
}

function font() {
  return src("./src/fonts/*.*").pipe(dest("./static/fonts/"));
}

// Watch files
function watchFiles() {
  watch("./src/scss/*", scss);
  watch("./src/js/*", js);
  watch("./src/img/*/*", img);
  watch("./src/parts/*.html", minify);
  watch("./src/*.html", minify);
  livereload();
}

// BrowserSync
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });
}

// Tasks to define the execution of the functions simultaneously or in series
exports.watch = series(
  clear,
  parallel(watchFiles, browserSync, minjs, js, font, css, scss, minify, img)
);
exports.default = series(clear, parallel(js, scss, img));

exports.img = series(minjs);
exports.fonts = series(css);
