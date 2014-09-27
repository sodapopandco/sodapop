# Gulp variables.
gulp = require("gulp")
plugins = require("gulp-load-plugins")()
child = require("child_process")
sync = require("browser-sync")

# Project directories.
paths =
  source: "source/"
  destination: "public/"
  assets: "assets/"
  images: "images/"
  scripts: "scripts/"
  styles: "styles/"

# Project domains.
domains =
  local: "domain"
  remote: "domain.com"
  repository: "user/repository"

# Serves and reloads the browser when stuff happens.
gulp.task "browser-sync", ->
  sync
    notify: false
    proxy: "heft.dev"
  return

# Clean the destination directory.
gulp.task "clean", ->
  gulp.src(paths.destination)
    .pipe plugins.clean()

# Minifies any HTML.
gulp.task "html", ["jekyll"], ->
  gulp.src(paths.destination + "**/*.html")
    .pipe plugins.htmlmin(
      collapseWhitespace: true
      removeComments: true
    )
    .pipe gulp.dest(paths.destination)
    .pipe sync.reload(stream: true)

# Minifies any images.
gulp.task "images", ->
  gulp.src(paths.source + "_assets/" + paths.images + "**/*.{gif,jpg,png,svg}")
    .pipe plugins.changed(paths.destination + paths.assets + paths.images)
    .pipe plugins.imagemin(
      progressive: true
      svgoPlugins: [removeViewBox: false]
    )
    .pipe gulp.dest(paths.destination + paths.assets + paths.images)
    .pipe sync.reload(stream: true)

# Builds the site.
gulp.task "jekyll", (done) ->
  child.spawn("jekyll", ["build"],
    stdio: "inherit"
  ).on "close", done

# Compiles any JavaScript files, minifies them, and reloads the browser.
gulp.task "scripts", ->
  gulp.src(paths.source + "_assets/" + paths.scripts + "*.js")
    .pipe plugins.concat("main.js")
    .pipe plugins.uglify()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(paths.destination + paths.assets + paths.scripts)
    .pipe sync.reload(stream: true)

# Compiles any Sass files, minifies them, and injects any changed CSS into the browser.
gulp.task "styles", ->
  gulp.src(paths.source + "_assets/" + paths.styles + "*.scss")
    .pipe plugins.sass(
      errLogToConsole: true
      # This is needed to stop the build failing.
      # Maybe source maps are required now?
      sourceComments: "map"
    )
    .pipe plugins.autoprefixer()
    .pipe gulp.dest(paths.destination + paths.assets + paths.styles)
    .pipe plugins.minifyCss()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(paths.destination + paths.assets + paths.styles)
    .pipe sync.reload(stream: true)

# Builds then reloads the site.
gulp.task "rebuild", ["html"], ->
  sync.reload()
  return

# Builds the site, compiles its CSS, and syncs the changes to the browser.
gulp.task "default", [
  "html"
  "images"
  "scripts"
  "styles"
  "browser-sync"
], ->
  gulp.watch paths.source + "**/*.{gif,jpg,png,svg}", ["images"]
  gulp.watch paths.source + "**/*.js", ["scripts"]
  gulp.watch paths.source + "**/*.scss", ["styles"]
  gulp.watch [
    "*.yml"
    paths.source + "**/*.{html,md,txt}"
  ], ["rebuild"]
  return
