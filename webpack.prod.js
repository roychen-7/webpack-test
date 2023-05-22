const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ESLintPlugin = require("eslint-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const WebpackBundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const HappyPack = require("happypack");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

// const smp = new SpeedMeasurePlugin();

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

const PATHS = {
  src: path.join(__dirname, "src"),
};

// module.exports = smp.wrap({
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
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(),
    new ESLintPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function () {
      this.hooks.done.tap("done", (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length > 0) {
          console.log("build error");
          process.exit(1);
        }
      });
    },
    new webpack.DllReferencePlugin({
      manifest: require("./build/library/library.json"),
    }),
    // new HardSourceWebpackPlugin(),
    // new WebpackBundleAnalyzerPlugin(),
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
      new TerserPlugin({ parallel: true }),
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
        include: path.resolve("src"),
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 4,
            },
          },
          "babel-loader",
          // "happypack/loader",
        ],
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
  resolve: {
    alias: {
      react: path.resolve(
        __dirname,
        "./node_modules/react/umd/react.production.min.js"
      ),
      "react-dom": path.resolve(
        __dirname,
        "./node_modules/react-dom/umd/react-dom.production.min.js"
      ),
    },
    extensions: [".js"],
    mainFields: ["main"],
  },
  // stats: "none",
  // });
};
