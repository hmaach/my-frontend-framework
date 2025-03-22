import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { patchDOM } from "./patch-dom.js";
import { mountDOM } from "./mount-dom.js";

export function createApp({ state, reducers, view }) {
  let currentState = state;
  let rootElement = null;
  let oldTree = null;
  
  function emit(action, payload) {
    const reducer = reducers[action];
    if (reducer) {
      currentState = reducer(currentState, payload);
      render();
    }
  }

  function render() {
    const newTree = view(currentState, emit);
    
    if (!rootElement) {
      return;
    }

    if (!oldTree) {
      mountDOM(newTree, rootElement);
    } else {
      patchDOM(oldTree, newTree, rootElement);
    }
    
    oldTree = newTree;
  }

  return {
    emit,
    mount(element) {
      rootElement = element;
      render();
    },
    unmount() {
      if (oldTree) {
        destroyDOM(oldTree);
      }
      rootTree = null;
      oldTree = null;
    }
  };
}
