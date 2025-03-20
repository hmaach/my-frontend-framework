import { DOM_TYPES } from "./dom.js";
import { setAttributes } from "./attributes.js";
import { addEventListeners } from "./events.js";

export class DOMMount {
    static mountDOM(vdom, parentEl, index) {
        switch (vdom.type) {
            case DOM_TYPES.TEXT: {
                DOMMount.createTextNode(vdom, parentEl, index);
                break;
            }
            case DOM_TYPES.ELEMENT: {
                DOMMount.createElementNode(vdom, parentEl, index);
                break;
            }
            case DOM_TYPES.FRAGMENT: {
                DOMMount.createFragmentNodes(vdom, parentEl, index);
                break;
            }
            default: {
                throw new Error(`Can't mount DOM of type: ${vdom.type}`);
            }
        }
    }

    static insert(el, parentEl, index) {
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

    static createTextNode(vdom, parentEl, index) {
        const { value } = vdom;
        const textNode = document.createTextNode(value);
        vdom.el = textNode;
        DOMMount.insert(textNode, parentEl, index);
    }

    static createFragmentNodes(vdom, parentEl, index) {
        const { children } = vdom;
        vdom.el = parentEl;
        children.forEach((child, i) =>
            DOMMount.mountDOM(child, parentEl, index ? index + i : null)
        );
    }

    static createElementNode(vdom, parentEl, index) {
        const { tag, props, children } = vdom;
        const element = document.createElement(tag);
        DOMMount.addProps(element, props, vdom);
        vdom.el = element;
        children.forEach((child) => DOMMount.mountDOM(child, element));
        DOMMount.insert(element, parentEl, index);
    }

    static addProps(el, props, vdom) {
        const { on: events, ...attrs } = props;
        if (events) {
            const normalizedEvents = {};
            Object.entries(events).forEach(([eventName, handler]) => {
                const normalizedName = eventName.toLowerCase().replace(/^on/, '');
                normalizedEvents[normalizedName] = handler;
            });
            vdom.listeners = addEventListeners(normalizedEvents, el);
        }
        setAttributes(el, attrs);
    }
}

export const { mountDOM } = DOMMount;
