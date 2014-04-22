desc "Delete any existing files and start anew."
task :cleanup do
  puts "Removed all existing generated files."
  system "rm -rf public"
end

desc "Continuously generate the site."
task :default do
  pids = [
    spawn("sass --watch source/_assets/stylesheets:public/assets/stylesheets"),
    spawn("jekyll -w build")
  ]

  trap "INT" do
    Process.kill "INT", *pids
    exit 1
  end

  loop do
    sleep 1
  end
end
