const TEXT_ELEMENT = "TEXT_ELEMENT";

function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === "object" ? child : createTextElement(child);
      })
    }
  };
}

function render(element, container) {
  const dom =
    element.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProp = key => key !== "children";
  Object.keys(element.props)
    .filter(isProp)
    .forEach(prop => {
      dom[prop] = element.props[prop];
    });
  console.log(element);

  element.props.children.forEach(child => {
    render(child, dom);
  });
  container.appendChild(dom);
}

const Didact = {
  createElement,
  render
};

export default Didact;
