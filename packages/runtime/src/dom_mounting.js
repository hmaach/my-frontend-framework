import { setAttributes } from './attrs.js'
import { addEventListeners } from './events.js'
import { DOM_TYPES } from './h.js'

export const mountDOM = (virtualDom, parentElement, index, hostComponent = null) => {

    switch (virtualDom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(virtualDom, parentElement, index)
            break
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(virtualDom, parentElement, index)
            break
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNodes(virtualDom, parentElement, index)
            break
        }
        case DOM_TYPES.COMPONENT: {
            createComponentNode(vdom, parentEl, index, hostComponent)
            break
        }
        default: {
            throw new Error(`Can't mount DOM of type: ${virtualDom.type}`)
        }
    }
}

const createElementNode = (virtualDom, parentElement, index) => {
    const { tag, props, children } = virtualDom

    const ElementNode = document.createElement(tag)
    addProps(ElementNode, props, virtualDom)
    virtualDom.el = ElementNode

    children.forEach((child) => mountDOM(child, ElementNode))
    insert(ElementNode, parentElement, index)
}

const createTextNode = (virtualDom, parentElement, index) => {
    const textNode = document.createTextNode(virtualDom.value)
    virtualDom.el = textNode
    insert(textNode, parentElement, index)
}

const createFragmentNodes = (virtualDom, parentEl, index) => {
    const { children } = virtualDom
    virtualDom.el = parentEl
    children.forEach((child, i) =>
        mountDOM(child, parentEl, index ? index + i : null)
    )
}

function addProps(el, props, vdom) {
    const { on: events, ...attrs } = props
    vdom.listeners = addEventListeners(events, el)
    setAttributes(el, attrs)
}

function insert(el, parentEl, index) {
    // If index is null or undefined, simply append.
    if (index == null) {
        parentEl.append(el)
        return
    }

    if (index < 0) {
        throw new Error(`Index must be a positive integer, got ${index}`)
    }

    const children = parentEl.childNodes
    if (index >= children.length) {
        parentEl.append(el)
    } else {
        parentEl.insertBefore(el, children[index])
    }
}