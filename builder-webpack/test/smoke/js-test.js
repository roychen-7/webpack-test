const glob = require("glob-all");

describe("Checking js", () => {
  it("should gen js files", (done) => {
    const files = glob.sync(["./dist/index.js", "./dist/search.js"]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error("no css files");
    }
  });
});
