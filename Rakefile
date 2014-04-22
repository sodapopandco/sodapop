desc "Delete any existing files and start anew."
task :cleanup do
  puts "Removed all existing generated files."
  system "rm -rf public"
end

desc "Generate the site."
task :default do
  system "sass --watch source/_assets/stylesheets:public/assets/stylesheets"
  system "jekyll -w build"
end
