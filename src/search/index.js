import React from "react";
import { createRoot } from "react-dom/client";

import test from "./test.png";
import "./index.less";

const Search = () => {
  return (
    <>
      <div className="main">Search</div>
      <img src={test} />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Search />);
