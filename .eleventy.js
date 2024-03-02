module.exports = function (eleventyConfig) {
  // Set directories to pass through to the public folder
  eleventyConfig.addPassthroughCopy("assets");

  return {
    // Set input and output directories
    dir: {
      input: "./",
      output: "./public",

      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
