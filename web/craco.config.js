const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  style: {
    postcssOptions: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
};
