# Gulp variables.
gulp = require("gulp")
plugins = require("gulp-load-plugins")()
child = require("child_process")
sync = require("browser-sync")

# Project directories.
sourceDir = "source/"
sourceAssetsDir = "_assets/"
destinationDir = "public/"
destinationAssetsDir = "assets/"
imagesDir = "images/"
scriptsDir = "scripts/"
stylesDir = "styles/"

# Project domains.
localDomain = "domain"
liveDomain = "domain.com"
repoDomain = "user/repository"

# Serves and reloads the browser when stuff happens.
gulp.task "browser-sync", ->
  sync
    notify: false
    proxy: "heft.dev"
  return

# Clean the destination directory.
gulp.task "clean", ->
  gulp.src("destinationDir")
    .pipe clean()

# Minifies any images.
gulp.task "images", ->
  gulp.src(sourceDir + sourceAssetsDir + imagesDir + "**/*")
    .pipe plugins.changed(destinationDir + destinationAssetsDir + imagesDir)
    .pipe plugins.imagemin(
      progressive: true
      svgoPlugins: [removeViewBox: false]
    )
    .pipe gulp.dest(destinationDir + destinationAssetsDir + imagesDir)
    .pipe sync.reload(stream: true)

# Builds the site.
gulp.task "jekyll", (done) ->
  child.spawn("jekyll", ["build"],
    stdio: "inherit"
  ).on "close", done

# Compiles any JavaScript files, minifies them, and reloads the browser.
gulp.task "scripts", ->
  gulp.src(sourceDir + sourceAssetsDir + scriptsDir + "*.js")
    .pipe plugins.concat("main.js")
    .pipe plugins.uglify()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(destinationDir + destinationAssetsDir + scriptsDir)
    .pipe sync.reload(stream: true)

# Compiles any Sass files, minifies them, and injects any changed CSS into the browser.
gulp.task "styles", ->
  gulp.src(sourceDir + sourceAssetsDir + stylesDir + "*.scss")
    .pipe plugins.sass(
      # This is needed to stop the build failing.
      # Maybe source maps are required now?
      sourceComments: "map"
    )
    .pipe plugins.autoprefixer()
    .pipe plugins.minifyCss()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(destinationDir + destinationAssetsDir + stylesDir)
    .pipe sync.reload(stream: true)

# Builds then reloads the site.
gulp.task "rebuild", ["jekyll"], ->
  sync.reload()
  return

# Builds the site, compiles its CSS, and syncs the changes to the browser.
gulp.task "default", [
  "jekyll"
  "images"
  "scripts"
  "styles"
  "browser-sync"
], ->
  gulp.watch sourceDir + sourceAssetsDir + imagesDir + "**/*", ["images"]
  gulp.watch sourceDir + "**/*.js", ["scripts"]
  gulp.watch sourceDir + "**/*.scss", ["styles"]
  gulp.watch [
    "*.yml"
    sourceDir + "**/*.html"
    sourceDir + "**/*.md"
    sourceDir + "**/*.txt"
  ], ["rebuild"]
  return
