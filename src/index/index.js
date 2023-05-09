import React from "react";
import { createRoot } from "react-dom/client";

import test from "./test.png";
import "./index.less";

const App = () => {
  debugger;
  return (
    <>
      <div className="main">App</div>
      <img src={test} />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
