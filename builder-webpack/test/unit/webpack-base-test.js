const assert = require("assert");

describe("webpack.base.js", () => {
  const baseConfig = require("../../lib/webpack.base");
  it("entry", () => {
    assert.equal(
      baseConfig.entry.index,
      "/Users/roychen/Bytedance/webpack-test/builder-webpack/test/smoke/template/src/index/index.js"
    );
  });
});
