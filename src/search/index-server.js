const React = require("react");
require("./index.less");
const test = require("./test.png").default;

const Search = () => {
  return (
    <>
      <div className="main">Search</div>
      <img src={test} onClick={() => {}} />
    </>
  );
};

module.exports = <Search />;
