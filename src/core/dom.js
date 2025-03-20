import { cleanArray } from "../utils/arrays.js";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

export class DOM {
  static h(tag, props = {}, children = []) {
    return {
      tag,
      props,
      children: DOM.mapTextNodes(cleanArray(children)),
      type: DOM_TYPES.ELEMENT,
    };
  }

  static mapTextNodes(children) {
    return children.map((child) =>
      typeof child === "string" ? DOM.hString(child) : child
    );
  }

  static hString(str) {
    return { type: DOM_TYPES.TEXT, value: str };
  }

  static hFragment(vNodes) {
    return {
      type: DOM_TYPES.FRAGMENT,
      children: DOM.mapTextNodes(cleanArray(vNodes)),
    };
  }

  static extractChildren(vdom) {
    if (vdom.children == null) {
      return [];
    }
    const children = [];
    for (const child of vdom.children) {
      if (child.type === DOM_TYPES.FRAGMENT) {
        children.push(...DOM.extractChildren(child, children));
      } else {
        children.push(child);
      }
    }
    return children;
  }
}

export const { h, hString, hFragment, extractChildren } = DOM;
