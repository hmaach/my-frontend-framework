import { DOM_TYPES, hFragment } from "./dom.js";
import { traverseDFS } from "./traverse-dom.js";

export function fillSlots(vdom, externalContent = []) {
  function processNode(node, parent, index) {
    insertViewInSlot(node, parent, index, externalContent);
  }

  traverseDFS(vdom, processNode, shouldSkipBranch);
}

function insertViewInSlot(node, parent, index, externalContent) {
  if (node.type !== DOM_TYPES.SLOT) return;

  const defaultContent = node.children;
  const views = externalContent.length > 0 ? externalContent : defaultContent;

  const hasContent = views.length > 0;
  if (hasContent) {
    parent.children.splice(index, 1, hFragment(views));
  } else {
    parent.children.splice(index, 1);
  }
}

function shouldSkipBranch(node) {
  return node.type === DOM_TYPES.COMPONENT;
}
