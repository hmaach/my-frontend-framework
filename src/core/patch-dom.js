import { destroyDOM } from "./destroy-dom.js";
import { mountDOM } from "./mount-dom.js";
import { areNodesEqual } from "./nodes-equal.js";
import {
  removeAttribute,
  setAttribute,
  removeStyle,
  setStyle,
} from "./attributes.js";
import { objectsDiff } from "../utils/objects.js";
import {
  arraysDiff,
  arraysDiffSequence,
  ARRAY_DIFF_OP,
} from "../utils/arrays.js";
import { isNotBlankOrEmptyString } from "../utils/strings.js";
import { addEventListener } from "./events.js";
import { DOM_TYPES, extractChildren } from "./dom.js";

export class DOMPatcher {
  static patchDOM(oldVdom, newVdom, parentEl) {
    if (!areNodesEqual(oldVdom, newVdom)) {
      const index = DOMPatcher.findIndexInParent(parentEl, oldVdom.el);
      destroyDOM(oldVdom);
      mountDOM(newVdom, parentEl, index);
      return newVdom;
    }

    newVdom.el = oldVdom.el;

    switch (newVdom.type) {
      case DOM_TYPES.TEXT: {
        DOMPatcher.patchText(oldVdom, newVdom);
        return newVdom;
      }
      case DOM_TYPES.ELEMENT: {
        DOMPatcher.patchElement(oldVdom, newVdom);
        break;
      }
    }

    DOMPatcher.patchChildren(oldVdom, newVdom);
    return newVdom;
  }

  static findIndexInParent(parentEl, el) {
    const index = Array.from(parentEl.childNodes).indexOf(el);
    return index < 0 ? null : index;
  }

  static patchText(oldVdom, newVdom) {
    const el = oldVdom.el;
    const { value: oldText } = oldVdom;
    const { value: newText } = newVdom;
    if (oldText !== newText) {
      el.nodeValue = newText;
    }
  }

  static patchElement(oldVdom, newVdom) {
    const el = oldVdom.el;
    const {
      class: oldClass,
      style: oldStyle,
      on: oldEvents,
      ...oldAttrs
    } = oldVdom.props;
    const {
      class: newClass,
      style: newStyle,
      on: newEvents,
      ...newAttrs
    } = newVdom.props;
    const { listeners: oldListeners } = oldVdom;
    DOMPatcher.patchAttrs(el, oldAttrs, newAttrs);
    DOMPatcher.patchClasses(el, oldClass, newClass);
    DOMPatcher.patchStyles(el, oldStyle, newStyle);
    newVdom.listeners = DOMPatcher.patchEvents(el, oldListeners, oldEvents, newEvents);
  }

  static patchAttrs(el, oldAttrs, newAttrs) {
    const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);
    for (const attr of removed) {
      removeAttribute(el, attr);
    }
    for (const attr of added.concat(updated)) {
      setAttribute(el, attr, newAttrs[attr]);
    }
  }

  static patchClasses(el, oldClass, newClass) {
    const oldClasses = DOMPatcher.toClassList(oldClass);
    const newClasses = DOMPatcher.toClassList(newClass);
    const { added, removed } = arraysDiff(oldClasses, newClasses);

    if (removed.length > 0) {
      el.classList.remove(...removed);
    }
    if (added.length > 0) {
      el.classList.add(...added);
    }
  }

  static toClassList(classes = "") {
    return Array.isArray(classes)
      ? classes.filter(isNotBlankOrEmptyString)
      : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
  }

  static patchStyles(el, oldStyle = {}, newStyle = {}) {
    const { added, removed, updated } = objectsDiff(oldStyle, newStyle);
    for (const style of removed) {
      removeStyle(el, style);
    }
    for (const style of added.concat(updated)) {
      setStyle(el, style, newStyle[style]);
    }
  }

  static patchEvents(el, oldListeners = {}, oldEvents = {}, newEvents = {}) {
    const { removed, added, updated } = objectsDiff(oldEvents, newEvents);
    for (const eventName of removed.concat(updated)) {
      el.removeEventListener(eventName, oldListeners[eventName]);
    }
    const addedListeners = {};
    for (const eventName of added.concat(updated)) {
      const listener = addEventListener(eventName, newEvents[eventName], el);
      addedListeners[eventName] = listener;
    }
    return addedListeners;
  }

  static patchChildren(oldVdom, newVdom) {
    const oldChildren = extractChildren(oldVdom);
    const newChildren = extractChildren(newVdom);
    const parentEl = oldVdom.el;
    const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);
    for (const operation of diffSeq) {
      const { originalIndex, index, item } = operation;
      switch (operation.op) {
        case ARRAY_DIFF_OP.ADD: {
          mountDOM(item, parentEl, index);
          break;
        }
        case ARRAY_DIFF_OP.REMOVE: {
          destroyDOM(item);
          break;
        }
        case ARRAY_DIFF_OP.MOVE: {
          const oldChild = oldChildren[originalIndex];
          const newChild = newChildren[index];
          const el = oldChild.el;
          const elAtTargetIndex = parentEl.childNodes[index];
          parentEl.insertBefore(el, elAtTargetIndex);
          DOMPatcher.patchDOM(oldChild, newChild, parentEl);
          break;
        }
        case ARRAY_DIFF_OP.NOOP: {
          DOMPatcher.patchDOM(oldChildren[originalIndex], newChildren[index], parentEl);
          break;
        }
      }
    }
  }
}

export const { patchDOM } = DOMPatcher;
