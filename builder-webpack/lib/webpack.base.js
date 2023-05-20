const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const glob = require("glob");
const path = require("path");

const projectRoot = process.cwd();
console.log(projectRoot);

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(projectRoot, "./src/*/index.js"));
  Object.keys(entryFiles).forEach((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);

    const pageName = match && match[1];

    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, "src", pageName, "index.html"),
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
  entry,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
    }),
    new CleanWebpackPlugin(),
    ...htmlWebpackPlugins,
    new FriendlyErrorsWebpackPlugin(),
    function hooksDown() {
      this.hooks.done.tap("done", (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length > 0) {
          process.exit(1);
        }
      });
    },
  ],
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
  stats: "none",
};
