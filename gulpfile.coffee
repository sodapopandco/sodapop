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
gulp.task "browser-sync", ["compile"], ->
  browser
    notify: false
    proxy: domains.local + ".dev"
  return

# Build the site.
gulp.task "build", ["clean"], ->
  gulp.start(
    "compile"
    "compress"
  )

# Clean the destination directory.
gulp.task "clean", ->
  gulp.src(paths.destination, read: false)
    .pipe plugins.clean()

# Compress the site.
gulp.task "compress", [
  "compress:html"
  "compress:images"
  "compress:scripts"
  "compress:styles"
], ->

# Minifies the HTML.
gulp.task "compress:html", ["compile:html"], ->
  gulp.src(paths.destination + "**/*.html")
    .pipe plugins.htmlmin(
      collapseWhitespace: true
      removeComments: true
    )
    .pipe gulp.dest(paths.destination)

# Minifies any image files.
gulp.task "compress:images", ["compile:images"], ->
  gulp.src(paths.destination + paths.assets + paths.images + "**/*.{gif,jpg,png,svg}")
    .pipe plugins.imagemin(
      progressive: true
      svgoPlugins: [removeViewBox: false]
    )
    .pipe gulp.dest(paths.destination + paths.assets + paths.images)

# Minifies any JavaScript files.
gulp.task "compress:scripts", ["compile:scripts"], ->
  gulp.src(paths.destination + paths.assets + paths.scripts + "*.js")
    .pipe plugins.uglify()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(paths.destination + paths.assets + paths.scripts)

# Minifies any CSS files.
gulp.task "compress:styles", ["compile:styles"], ->
  gulp.src(paths.destination + paths.assets + paths.styles + "*.css")
    .pipe plugins.minifyCss()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest(paths.destination + paths.assets + paths.styles)

# Compiles the site.
gulp.task "compile", [
  "compile:html"
  "compile:images"
  "compile:scripts"
  "compile:styles"
], ->

# Compiles the HTML using Jekyll.
gulp.task "compile:html", (done) ->
  process.spawn("jekyll", ["build"],
    stdio: "inherit"
  ).on "close", done

# Copies any image files to the destination directory and reloads the browser.
gulp.task "compile:images", ->
  gulp.src(paths.source + "_assets/" + paths.images + "**/*.{gif,jpg,png,svg}")
    .pipe plugins.changed(paths.destination + paths.assets + paths.images)
    .pipe gulp.dest(paths.destination + paths.assets + paths.images)
    .pipe browser.reload(stream: true)

# Compiles any JavaScript files and reloads the browser.
gulp.task "compile:scripts", ->
  gulp.src(paths.source + "_assets/" + paths.scripts + "*.js")
    .pipe plugins.concat("main.js")
    .pipe gulp.dest(paths.destination + paths.assets + paths.scripts)
    .pipe browser.reload(stream: true)

# Compiles any Sass files and injects any new or changed CSS into the browser.
gulp.task "compile:styles", ->
  gulp.src(paths.source + "_assets/" + paths.styles + "*.scss")
    .pipe plugins.sass(
      errLogToConsole: true
      # The task fails without this. Maybe source maps are required now?
      sourceComments: "map"
    )
    .pipe plugins.autoprefixer()
    .pipe gulp.dest(paths.destination + paths.assets + paths.styles)
    .pipe browser.reload(stream: true)

# Compiles the HTML and reloads the browser.
gulp.task "rebuild", ["compile:html"], ->
  browser.reload()
  return

# View the local, live, and GitHub domain.
gulp.task "view", [
  "view:local"
  "view:live"
  "view:repo"
], ->

# View the local domain.
gulp.task "view:local", ["compile"], ->
  gulp.src("")
    .pipe plugins.shell("open http://" + domains.local + ".dev")

# View the live domain.
gulp.task "view:live", ->
  gulp.src("")
    .pipe plugins.shell("open http://" + domains.live)

# View the repository on GitHub.
gulp.task "view:repo", ->
  gulp.src("")
    .pipe plugins.shell("open http://github.com/" + domains.repository)

# Compiles the site and syncs any changes to the browser.
gulp.task "default", [
  "compile"
  "browser-sync"
], ->
  gulp.watch paths.source + "**/*.{gif,jpg,png,svg}", ["compile:images"]
  gulp.watch paths.source + "**/*.js", ["compile:scripts"]
  gulp.watch paths.source + "**/*.scss", ["compile:styles"]
  gulp.watch [
    "*.yml"
    paths.source + "**/*.{html,md,txt}"
  ], ["rebuild"]
  return
