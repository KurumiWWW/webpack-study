const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: resolve(__dirname, "build"),
    clean: true,
    assetModuleFilename: "images/[contenthash][ext]",
  },
  module: {
    rules: [],
  },
  // devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  mode: "development",
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset/resource",
        generator: {
          filename: "images/[contenthash][ext]",
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.jpg$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 * 1024, // 4M
          },
        },
      },
    ],
  },
};
