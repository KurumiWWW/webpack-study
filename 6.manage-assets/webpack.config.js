const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: resolve(__dirname, "build"),
    clean: true,
  },
  module: {
    rules: [
      // {
      //   test: /\.scss$/,
      //   use: ["style-loader", "css-loader", "sass-loader"],
      // },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  // devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[contenthash].css",
    }),
  ],
  // mode: "development",
  mode: "production",
  devServer: {
    static: "./dist",
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
