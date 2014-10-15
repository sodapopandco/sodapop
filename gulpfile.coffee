# Gulp variables.
gulp = require("gulp")
plugins = require("gulp-load-plugins")()
browser = require("browser-sync")
del = require("del")

# Project directories.
paths =

  # Local
  source: "source/"
  destination: "public/"
  assets: "assets/"
  images: "images/"
  scripts: "javascripts/"
  styles: "stylesheets/"

  # Remote
  remote: "/var/www/sodapop.is/"
  public: "public/"

# Project domains.
domains =
  local: "sodapop"
  live: "sodapop.is"
  repository: "everycopy/sodapop"

# Project server.
server =
  user: "domains"
  address: "ocean.sodapop.is"
  port: "41284"

# Build the site.
gulp.task "build", ["compile"], ->
  gulp.start "compress"

# Clean the destination directory.
gulp.task "clean", (cb) ->
  del ["#{paths.destination}"], cb

# Clean anything that isn't an asset.
gulp.task "clean:all", (cb) ->
  del [
    "#{paths.destination}**/*"
    "!#{paths.destination}#{paths.assets}**/*"
  ], cb

# Clean the destination images directory.
gulp.task "clean:images", (cb) ->
  del ["#{paths.destination}#{paths.assets}#{paths.images}"], cb

# Clean the destination scripts directory.
gulp.task "clean:scripts", (cb) ->
  del ["#{paths.destination}#{paths.assets}#{paths.scripts}"], cb

# Clean the destination styles directory.
gulp.task "clean:styles", (cb) ->
  del ["#{paths.destination}#{paths.assets}#{paths.styles}"], cb

# Compress the site.
gulp.task "compress", [
  "compress:html"
  "compress:images"
  "compress:scripts"
  "compress:styles"
], ->

# Minifies the HTML.
gulp.task "compress:html", ->
  gulp.src "#{paths.destination}**/*.html"
    .pipe plugins.htmlmin(
      collapseWhitespace: true
      minifyJS: true
      removeComments: true
    )
    .pipe gulp.dest "#{paths.destination}"

# Minifies any image files.
gulp.task "compress:images", ->
  gulp.src "#{paths.destination}**/*.{gif,jpg,png,svg}"
    .pipe plugins.imagemin(
      interlaced: true
      progressive: true
      svgoPlugins: [removeViewBox: false]
    )
    .pipe gulp.dest "#{paths.destination}"

# Minifies any JavaScript files.
gulp.task "compress:scripts", ->
  gulp.src "#{paths.destination}#{paths.assets}#{paths.scripts}*.js"
    .pipe plugins.uglify()
    .pipe plugins.rename(suffix: ".min")
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}"

# Minifies any CSS files.
gulp.task "compress:styles", ->
  gulp.src "#{paths.destination}#{paths.assets}#{paths.styles}*.css"
    .pipe plugins.base64(baseDir: "public")
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
gulp.task "compile:images", ["clean:images"], ->
  gulp.src [
    "#{paths.source}_assets/images/**/*.{gif,jpg,png,svg}"
    "!#{paths.source}_assets/images/screenshots/**/*.png"
  ]
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.images}"
    .pipe browser.reload(stream: true)

# Compiles any JavaScript files and reloads the browser.
gulp.task "compile:scripts", ["clean:scripts"], ->
  gulp.src "#{paths.source}_assets/scripts/*.coffee"
    .pipe plugins.coffee(bare:true)
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}"
    .pipe plugins.concat("main.js")
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}"
    .pipe browser.reload(stream: true)

  gulp.src "bower_components/html5shiv/dist/html5shiv.js"
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}vendor/"

  gulp.src "bower_components/jquery/dist/jquery.js"
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.scripts}vendor/"


# Compiles any Sass files and injects any new or changed CSS into the browser.
gulp.task "compile:styles", ["clean:styles"], ->
  gulp.src "#{paths.source}_assets/styles/*.scss"
    .pipe plugins.sass(errLogToConsole: true)
    .pipe plugins.autoprefixer()
    .pipe plugins.combineMediaQueries(log: true)
    .pipe plugins.concat("main.css")
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.styles}"
    .pipe browser.reload(stream: true)

  gulp.src "bower_components/normalize-css/normalize.css"
    .pipe gulp.dest "#{paths.destination}#{paths.assets}#{paths.styles}vendor/"

# Deploy the site to the public server.
gulp.task "deploy", ["build"], plugins.shell.task "rsync -avze 'ssh -p #{server.port}' --delete #{paths.destination} #{server.user}@#{server.address}:#{paths.remote}#{paths.public}"

# Compiles the site using Jekyll.
gulp.task "jekyll:build", ["clean:all"], plugins.shell.task "jekyll build"

# Compiles the site using Jekyll and recompiles when there are changes.
gulp.task "jekyll:watch", plugins.shell.task "jekyll build -w"

# Build and serve the site.
gulp.task "serve", ["compile"], ->
  browser
    notify: true
    proxy: "#{domains.local}.dev"
    xip: true

# View the local, live, and GitHub domain.
gulp.task "view", [
  "view:local"
  "view:xip"
  "view:live"
  "view:repo"
], ->

# View the local domain.
gulp.task "view:local", ["build"], plugins.shell.task "open http://#{domains.local}.dev"

# View the virtual domain.
gulp.task "view:xip", ["build"], plugins.shell.task "ip=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{ print $2 }') && open http://#{domains.local}.$ip.xip.io"

# View the live domain.
gulp.task "view:live", plugins.shell.task "open http://#{domains.live}"

# View the repository on GitHub.
gulp.task "view:repo", plugins.shell.task "open http://github.com/#{domains.repository}"

# Compiles the site and syncs any changes to the browser.
gulp.task "default", ->
  gulp.start "serve"

  plugins.watch [
      "#{paths.destination}**/*"
      "!#{paths.destination}#{paths.assets}**/*"
    ], ->
    browser.reload()

  plugins.watch [
      "#{paths.source}_assets/images/"
      "#{paths.source}**/*.{gif,jpg,png,svg}"
    ], ->
    gulp.start "compile:images"

  plugins.watch "#{paths.source}**/*.coffee", ->
    gulp.start "compile:scripts"

  plugins.watch "#{paths.source}**/*.scss", ->
    gulp.start "compile:styles"

  plugins.watch [
      "#{paths.source}**/*"
      "!#{paths.source}_assets/**/*"
    ], ->
    gulp.start "jekyll:watch"
