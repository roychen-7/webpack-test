const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

const ssrConfig = {
  mode: "production",
  plugins: [
    new CssMinimizerPlugin({
      test: /\.css$/i,
      parallel: true,
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "react",
          entry: "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
          global: "React",
        },
        {
          module: "react-dom",
          entry:
            "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
          global: "ReactDOM",
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          level: {
            1: {
              roundingPrecision: "all=3,px=5",
            },
          },
        },
        minify: [
          CssMinimizerPlugin.cssnanoMinify,
          CssMinimizerPlugin.cleanCssMinify,
        ],
      }),
    ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          minChunks: 2,
          name: "commons",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: "ignore-loader",
      },
      {
        test: /.less$/,
        use: "ignore-loader",
      },
    ],
  },
};

module.exports = webpackMerge(baseConfig, ssrConfig);
