const { merge } = require("webpack-merge");
const webpack = require("webpack");
const baseConfig = require("./webpack.base");

const devConfig = {
  mode: "development",
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    static: "./dist",
    hot: true,
    stats: "errors-only",
  },
  devtool: "source-map",
};

module.exports = merge(baseConfig, devConfig);
