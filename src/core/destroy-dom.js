import { removeEvListeners } from './events.js'
import { DOM_TYPES } from './dom.js'

export class DOMDestroyer {
    static destroyDOM(vdom) {
        const { type } = vdom;
        switch (type) {
            case DOM_TYPES.TEXT: {
                DOMDestroyer.removeTextNode(vdom);
                break;
            }
            case DOM_TYPES.ELEMENT: {
                DOMDestroyer.removeElementNode(vdom);
                break;
            }
            case DOM_TYPES.FRAGMENT: {
                DOMDestroyer.removeFragmentNodes(vdom);
                break;
            }
            default: {
                throw new Error(`Can't destroy DOM of type: ${type}`);
            }
        }
        delete vdom.el;
    }

    static removeTextNode(vdom) {
        const { el } = vdom
        el.remove()
    }

    static removeElementNode(vdom) {
        const { el, children, listeners, props } = vdom
        el.remove()
        children.forEach(DOMDestroyer.destroyDOM)
        if (props && props.on) {
            removeEvListeners(props.on, el)
            delete vdom.listeners
        }
    }

    static removeFragmentNodes(vdom) {
        const { children } = vdom
        children.forEach(DOMDestroyer.destroyDOM)
    }
}

export const { destroyDOM } = DOMDestroyer;