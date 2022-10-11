const path = require("path")
module.exports = {
  experimental: {
    scrollRestoration: true
  },
  images: {
    loader: "imgix",
    path: ""
    // disableStaticImages: true
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  }
}
