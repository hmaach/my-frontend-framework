import { cleanArray } from "../utils/arrays.js";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
  COMPONENT: "component",
  SLOT: "slot",
};

export function h(tag, props = {}, children = []) {
  const type =
    typeof tag === "function" ? DOM_TYPES.COMPONENT : DOM_TYPES.ELEMENT;
  return {
    tag,
    props,
    type,
    children: mapTextNodes(cleanArray(children)),
  };
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
}

export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

export function hFragment(vNodes) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(cleanArray(vNodes)),
  };
}

export function extractChildren(vdom) {
  if (vdom.children == null) {
    return [];
  }
  const children = [];
  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child, children));
    } else {
      children.push(child);
    }
  }
  return children;
}

export function isComponent({ tag }) {
  return typeof tag === "function";
}

let hSlotCalled = false;

export function didCreateSlot() {
  return hSlotCalled;
}

export function resetDidCreateSlot() {
  hSlotCalled = false;
}

export function hSlot(children = []) {
  hSlotCalled = true;
  return { type: DOM_TYPES.SLOT, children };
}
