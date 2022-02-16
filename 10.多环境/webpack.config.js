const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = (env) => {
  console.log(env);
  return {
    entry: {
      index: "./src/index.js",
      another: "./src/another.js",
    },
    output: {
      filename: "scripts/[name].[contenthash].js",
      assetModuleFilename: "images/[contenthash][ext]",
      path: resolve(__dirname, "build"),
      clean: true,
      publicPath: "http://localhost:8080/",
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
        {
          test: /\.(tsv|csv)$/,
          use: "csv-loader",
        },
        {
          test: /\.xml$/,
          use: "xml-loader",
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
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
    mode: env.production ? "production" : "development",
    devServer: {
      static: "./dist",
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
      splitChunks: {
        // chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    performance: {
      hints: false,
    },
  };
};
