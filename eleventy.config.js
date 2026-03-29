export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("source/assets");
  eleventyConfig.addPassthroughCopy({ "source/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "source/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "source/robots.txt": "robots.txt" });

  eleventyConfig.setInputDirectory("source");
  eleventyConfig.setOutputDirectory("public");
  eleventyConfig.setIncludesDirectory("_includes");
  eleventyConfig.setLayoutsDirectory("_layouts");
  eleventyConfig.setDataDirectory("_data");
}
