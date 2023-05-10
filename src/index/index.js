import React from "react";
import { createRoot } from "react-dom/client";

import test from "./test.png";
import "./index.less";
import { commmon } from '../../common/index.js'

const App = () => {
  commmon()
  return (
    <>
      <div className="main">App</div>
      <img src={test} />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
