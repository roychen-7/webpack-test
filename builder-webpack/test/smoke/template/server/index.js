const express = require("express");
const fs = require("fs");
const path = require("path");
const { renderToString } = require("react-dom/server");
const SSR = require("../dist/search-server");
const template = fs.readFileSync(
  path.join(__dirname, "../dist/search.html"),
  "utf-8"
);

const data = {
  a: 1,
};

const server = (port) => {
  const app = express();

  app.use(express.static("./dist"));

  app.get("/search", (req, res) => {
    const html = renderMarkup(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => console.log("server is running"));
};

const renderMarkup = (str) => {
  return template
    .replace("<!--HTML_PLACEHOLDER-->", str)
    .replace(
      "<!--DATA_PLACEHOLDER-->",
      `<script>window.data=${JSON.stringify(data)}</script>`
    );
};

server(process.env.PORT || 3000);
