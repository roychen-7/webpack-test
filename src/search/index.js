import React from "react";
import { createRoot } from "react-dom/client";

import test from "./test.png";
import "./index.less";
// import { a } from './tree-shaking'
// import { commmon } from '../../common/index.js'

const Search = () => {
  // commmon()

  return (
    <>
      <div className="main">Search</div>
      <img src={test} onClick={() => {

      }} />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Search />);
