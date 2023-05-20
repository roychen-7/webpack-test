const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const webpack = requrie("webpack");

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

module.exports = webpackMerge(baseConfig, devConfig);
