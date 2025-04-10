import { DOM_TYPES } from "./dom.js";
import { setAttributes } from "./attributes.js";
import { addEvListeners } from "./events.js";
import { extractPropsAndEvents } from "../utils/props.js";
import { enqueueJob } from "./scheduler.js";

export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index, hostComponent);
      break;
    }
    case DOM_TYPES.COMPONENT: {
      createComponentNode(vdom, parentEl, index, hostComponent);
      enqueueJob(() => vdom.component.onMounted());
      break;
    }
    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
  }
}

function insert(el, parentEl, index) {
  if (index == null) {
    parentEl.append(el);
    return;
  }
  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`);
  }
  const children = parentEl.childNodes;
  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}

function createTextNode(vdom, parentEl, index) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  vdom.el = textNode;
  insert(textNode, parentEl, index);
}

function createFragmentNodes(vdom, parentEl, index, hostComponent) {
  const { children } = vdom;
  vdom.el = parentEl;

  for (const child of children) {
    mountDOM(child, parentEl, index, hostComponent);

    if (index == null) {
      continue;
    }

    switch (child.type) {
      case DOM_TYPES.FRAGMENT:
        index += child.children.length;
        break;
      case DOM_TYPES.COMPONENT:
        index += child.component.elements.length;
        break;
      default:
        index++;
    }
  }
}

function createElementNode(vdom, parentEl, index, hostComponent) {
  const { tag, children } = vdom;
  const element = document.createElement(tag);
  addProps(element, vdom, hostComponent);
  vdom.el = element;
  children.forEach((child) => mountDOM(child, element, null, hostComponent));
  insert(element, parentEl, index);
}

function addProps(el, vdom, hostComponent) {
  const { props: attrs, events } = extractPropsAndEvents(vdom);
  vdom.listeners = addEvListeners(events, el, hostComponent);
  setAttributes(el, attrs);
}

function createComponentNode(vdom, parentEl, index, hostComponent) {
  const { tag: Component, children } = vdom;
  const { props, events } = extractPropsAndEvents(vdom);
  const component = new Component(props, events, hostComponent);
  component.setAppContext(hostComponent?.appContext ?? {});
  component.setExternalContent(children);

  component.mount(parentEl, index);
  vdom.component = component;
  vdom.el = component.firstElement;
}
