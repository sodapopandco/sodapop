module.exports = function (eleventyConfig) {
  // Set directories and files to pass through to the public folder
  eleventyConfig.addPassthroughCopy("source/assets");
  eleventyConfig.addPassthroughCopy(
    "source/apple-touch-icon.png",
    "apple-touch-icon.png"
  );
  eleventyConfig.addPassthroughCopy("source/favicon.ico", "favicon.ico");
  eleventyConfig.addPassthroughCopy("source/robots.txt", "robots.txt");

  return {
    // Set input and output directories
    dir: {
      input: "./source",
      output: "./public",

      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
