import Didact from "./Didact";

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a href="#">foo</a>
    <br />
    <a href="#">bar</a>
  </div>
);
const container = document.getElementById("root");
Didact.render(element, container);
