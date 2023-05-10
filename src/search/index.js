import React from "react";
import { createRoot } from "react-dom/client";

import test from "./test.png";
import "./index.less";
import { commmon } from '../../common/index.js'

const Search = () => {
  commmon()
  return (
    <>
      <div className="main">Search</div>
      <img src={test} />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Search />);
