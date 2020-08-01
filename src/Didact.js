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

function createDom(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProp = key => key !== "children";
  Object.keys(fiber.props)
    .filter(isProp)
    .forEach(prop => {
      dom[prop] = fiber.props[prop];
    });
  
    return dom;
}

let nextUnitOfWork = null;
let wipRoot = null;

function performUnitOfWork(fiber) {
  //add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  //create new fibers
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index ++;
  } 
  // return new unit of work 
  if (fiber.child) {
    return fiber.child;
  } 
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function commitRoot() {
  // TODO add nodes to dom
}

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop);

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }
  nextUnitOfWork = wipRoot;
}


const Didact = {
  createElement,
  render
};

export default Didact;
