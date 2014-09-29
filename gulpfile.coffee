# Gulp variables.
gulp = require("gulp")
plugins = require("gulp-load-plugins")()
browser = require("browser-sync")

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

# Build the site.
gulp.task "build", ["clean"], ->
  gulp.start(
    "compile"
    "compress"
  )

# Clean the destination directory.
gulp.task "clean", ->
  gulp.src "#{paths.destination}", read: false
    .pipe plugins.clean()

# Compress the site.
gulp.task "compress", [
  "compress:html"
  "compress:images"
  "compress:scripts"
  "compress:styles"
], ->

# Minifies the HTML.
gulp.task "compress:html", ["jekyll:build"], ->
  gulp.src "#{paths.destination}**/*.html"
    .pipe plugins.htmlmin(
      collapseWhitespace: true
      removeComments: true
    )
    .pipe gulp.dest "#{paths.destination}"

# Minifies any image files.
gulp.task "compress:images", ["compile:images"], ->
  gulp.src "#{paths.destination}**/*.{gif,jpg,png,svg}"
    .pipe plugins.imagemin(
      progressive: true
      svgoPlugins: [removeViewBox: false]
    )
    .pipe gulp.dest "#{paths.destination}"

# Minifies any JavaScript files.
gulp.task "compress:scripts", ["compile:scripts"], ->
  gulp.src "#{paths.destination}#{paths.assets}#{paths.scripts}*.js"
    .pipe plugins.uglify()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}"

# Minifies any CSS files.
gulp.task "compress:styles", ["compile:styles"], ->
  gulp.src "#{paths.destination}#{paths.assets}#{paths.styles}*.css"
    .pipe plugins.minifyCss()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.styles}"

# Compiles the site.
gulp.task "compile", [
  "jekyll:build"
  "compile:images"
  "compile:scripts"
  "compile:styles"
], ->

# Copies any image files to the destination directory and reloads the browser.
gulp.task "compile:images", ->
  gulp.src "#{paths.source}_assets/images/**/*"
    .pipe plugins.changed "#{paths.destination}#{paths.assets}#{paths.images}"
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.images}"
    .pipe browser.reload(stream: true)

# Compiles any JavaScript files and reloads the browser.
gulp.task "compile:scripts", ->
  gulp.src "#{paths.source}_assets/scripts/*.coffee"
    .pipe plugins.coffee(bare:true)
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}"
    .pipe plugins.concat("main.js")
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}"
    .pipe browser.reload(stream: true)

# Compiles any Sass files and injects any new or changed CSS into the browser.
gulp.task "compile:styles", ->
  gulp.src "#{paths.source}_assets/styles/*.scss"
    .pipe plugins.sass(
      errLogToConsole: true
      # The task fails without this. Maybe source maps are required now?
      sourceComments: "map"
    )
    .pipe plugins.autoprefixer()
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.styles}"
    .pipe browser.reload(stream: true)

# Compiles the site using Jekyll.
gulp.task "jekyll:build", plugins.shell.task "jekyll build"

# Compiles the site using Jekyll and recompiles when there are changes.
gulp.task "jekyll:watch", plugins.shell.task "jekyll build -w"

# View the local, live, and GitHub domain.
gulp.task "view", [
  "view:local"
  "view:xip"
  "view:live"
  "view:repo"
], ->

# View the local domain.
gulp.task "view:local", ["compile"], plugins.shell.task "open http://#{domains.local}.dev"

# View the virtual domain.
gulp.task "view:xip", ["compile"], plugins.shell.task "ip=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{ print $2 }') && open http://#{domains.local}.$ip.xip.io"

# View the live domain.
gulp.task "view:live", plugins.shell.task "open http://#{domains.live}"

# View the repository on GitHub.
gulp.task "view:repo", plugins.shell.task "open http://github.com/#{domains.repository}"

# Compiles the site and syncs any changes to the browser.
gulp.task "default", ["compile"], ->
  browser
    notify: false
    proxy: "#{domains.local}.dev"

  gulp.watch "#{paths.source}_assets/images/**/*", ["compile:images"]
  gulp.watch "#{paths.source}_assets/**/*.coffee", ["compile:scripts"]
  gulp.watch "#{paths.source}_assets/**/*.scss", ["compile:styles"]
  gulp.watch [
      "#{paths.source}**/*"
      "!#{paths.source}_assets/"
      "!#{paths.source}_assets/**/*"
    ], ["jekyll:watch"]
  gulp.watch "#{paths.destination}**/*.html", browser.reload

  return
