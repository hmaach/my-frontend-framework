import { removeEvListeners } from "./events.js";
import { DOM_TYPES } from "./dom.js";
import { enqueueJob } from "./scheduler.js";

export function destroyDOM(vdom) {
  const { type } = vdom;
  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vdom);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      removeElementNode(vdom);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      removeFragmentNodes(vdom);
      break;
    }
    case DOM_TYPES.COMPONENT: {
      vdom.component.unmount();
      enqueueJob(() => vdom.component.onUnmounted());
      break;
    }
    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }
  delete vdom.el;
}

function removeTextNode(vdom) {
  const { el } = vdom;
  el.remove();
}

function removeElementNode(vdom) {
  const { el, children, listeners } = vdom;
  el.remove();
  children.forEach(destroyDOM);
  if (listeners) {
    removeEvListeners(listeners, el);
    delete vdom.listeners;
  }
}

function removeFragmentNodes(vdom) {
  const { children } = vdom;
  children.forEach(destroyDOM);
}
