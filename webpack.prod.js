const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ESLintPlugin = require("eslint-webpack-plugin");

const glob = require("glob");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);

    const pageName = match && match[1];

    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", pageName, "index.html"),
        filename: `${pageName}.html`,
        chunks: [pageName, "vendors"],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  mode: "production",
  // mode: "none",
  entry: entry,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash:8].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
    }),
    new CssMinimizerPlugin({
      test: /\.css$/i,
      parallel: true,
    }),
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(),
    new ESLintPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    //       global: 'ReactDOM',
    //     },
    //   ],
    // })
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
          // test: /(react|react-dom)/,
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
        test: /.js$/,
        use: ["babel-loader"],
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name][hash:8].[ext]",
              // limit: 100000,
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map",
};
