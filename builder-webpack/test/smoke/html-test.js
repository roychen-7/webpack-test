const glob = require("glob-all");

describe("Checking html", () => {
  it("should gen html files", (done) => {
    const files = glob.sync(["./dist/index.html", "./dist/search.html"]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error("no html files");
    }
  });
});
