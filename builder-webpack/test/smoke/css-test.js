const glob = require("glob-all");

describe("Checking css", () => {
  it("should gen css files", (done) => {
    const files = glob.sync(["./dist/index.*.css", "./dist/search.*.css"]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error("no css files");
    }
  });
});
