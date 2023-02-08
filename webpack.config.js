/*
Copyright (c) 2023, CloudBlue LLC
All rights reserved.
*/
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const generateHtmlPlugin = (title) => {
  const moduleName = title.toLowerCase();

  return new htmlWebpackPlugin({
    title,
    filename: `${moduleName}.html`,
    template: `./ui/pages/${moduleName}.html`,
    chunks: [moduleName]
  });
}

const populateHtmlPlugins = (pagesArray) => {
  res = [];
  pagesArray.forEach(page => {
    res.push(generateHtmlPlugin(page));
  })
  return res;
}

const pages = populateHtmlPlugins([
    "Index", "Settings", "Transformations/Multiplier_Settings", "Transformations/Simple_Settings",
]);

module.exports = {
  mode: 'production',
  entry: {
    index: __dirname + "/ui/src/pages/index.js",
    settings: __dirname + "/ui/src/pages/settings.js",
    ['transformations/multiplier_settings']: __dirname + "/ui/src/pages/transformations/multiplier_settings.js",
    ['transformations/simple_settings']: __dirname + "/ui/src/pages/transformations/simple_settings.js"
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'connect_ext/static'),
    clean: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
     minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    ...pages,
    new CopyWebpackPlugin({
      patterns: [
        { from: __dirname + "/ui/images", to: "images" },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "index.css",
      chunkFilename: "[id].css",
    }),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            },
          },
        ],
      },
    ],
  },
}
