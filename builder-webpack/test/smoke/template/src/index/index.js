import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import test from "./test.png";
import "./index.less";
import { commmon } from "../../common/index.js";
import largeNumber from "@cyroytest/large-number";

const App = () => {
  commmon();

  console.log(largeNumber(1, 2));

  return (
    <>
      <div className="main">App</div>
      <img
        src={test}
        onClick={() => {
          // import("./test").then(d => {
          //   console.log(d.default)
          //   d.default()
          // });
        }}
      />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
