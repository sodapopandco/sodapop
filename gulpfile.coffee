# Gulp variables.
gulp = require("gulp")
plugins = require("gulp-load-plugins")()
browser = require("browser-sync")
process = require("child_process")

# Project directories.
paths =
  source: "source/"
  destination: "public/"
  assets: "assets/"
  images: "images/"
  scripts: "javascripts/"
  styles: "stylesheets/"

# Project domains.
domains =
  local: "domain"
  live: "domain.com"
  repository: "user/repository"

# Serves and reloads the browser when stuff happens.
gulp.task "browser-sync", ->
  browser
    notify: false
    proxy: domains.local + ".dev"
  return

# Clean the destination directory.
gulp.task "clean", ->
  gulp.src(paths.destination)
    .pipe plugins.clean()

# Compress HTML, images, CSS, and JS.
gulp.task "compress", [
  "compress:html"
  "compress:images"
  "compress:scripts"
  "compress:styles"
], ->

gulp.task "compress:html", ["html"], ->
  gulp.src(paths.destination + "**/*.html")
    .pipe plugins.htmlmin(
      collapseWhitespace: true
      removeComments: true
    )
    .pipe gulp.dest(paths.destination)

gulp.task "compress:images", ["images"], ->
  gulp.src(paths.destination + paths.assets + paths.images + "**/*.{gif,jpg,png,svg}")
    .pipe plugins.imagemin(
      progressive: true
      svgoPlugins: [removeViewBox: false]
    )
    .pipe gulp.dest(paths.destination + paths.assets + paths.images)

gulp.task "compress:scripts", ["scripts"], ->
  gulp.src(paths.destination + paths.assets + paths.scripts + "*.js")
    .pipe plugins.uglify()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(paths.destination + paths.assets + paths.scripts)

gulp.task "compress:styles", ["styles"], ->
  gulp.src(paths.destination + paths.assets + paths.styles + "*.css")
    .pipe plugins.minifyCss()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(paths.destination + paths.assets + paths.styles)

# Builds the site.
gulp.task "html", (done) ->
  process.spawn("jekyll", ["build"],
    stdio: "inherit"
  ).on "close", done

# Copies images to the destination directory.
gulp.task "images", ->
  gulp.src(paths.source + "_assets/" + paths.images + "**/*.{gif,jpg,png,svg}")
    .pipe plugins.changed(paths.destination + paths.assets + paths.images)
    .pipe gulp.dest(paths.destination + paths.assets + paths.images)
    .pipe browser.reload(stream: true)

# Compiles any JavaScript files, minifies them, and reloads the browser.
gulp.task "scripts", ->
  gulp.src(paths.source + "_assets/" + paths.scripts + "*.js")
    .pipe plugins.concat("main.js")
    .pipe gulp.dest(paths.destination + paths.assets + paths.scripts)
    .pipe browser.reload(stream: true)

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
    .pipe browser.reload(stream: true)

# Builds then reloads the site.
gulp.task "rebuild", ["html"], ->
  browser.reload()
  return

# View various project related URLs.
gulp.task "view", [
  "html"
  "images"
  "scripts"
  "styles"
], ->
  gulp.src('')
    .pipe plugins.shell("open http://" + domains.local + ".dev")

gulp.task "view:live", ->
  gulp.src('')
    .pipe plugins.shell("open http://" + domains.live)

gulp.task "view:repo", ->
  gulp.src('')
    .pipe plugins.shell("open http://github.com/" + domains.repository)

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
