import { setAttributes } from './attrs.js'
import { addEventListeners } from './events.js'
import { DOM_TYPES } from './h.js'

export const mountDOM = (virtualDom, parentElement) => {
    
    switch (virtualDom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(virtualDom, parentElement)
            break
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(virtualDom, parentElement)
            break
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNodes(virtualDom, parentElement)
            break
        }
        default: {
            throw new Error(`Can't mount DOM of type: ${virtualDom.type}`)
        }
    }
}

const createElementNode = (virtualDom, parentElement) => {
    const { tag, props, children } = virtualDom

    const ElementNode = document.createElement(tag)
    addProps(ElementNode, props, virtualDom)
    virtualDom.el = ElementNode

    children.forEach((child) => mountDOM(child, ElementNode))
    parentElement.append(ElementNode)
}

const createTextNode = (virtualDom, parentElement) => {
    const textNode = document.createTextNode(virtualDom.value)
    virtualDom.el = textNode
    parentElement.append(textNode)
}

const createFragmentNodes = (virtualDom, parentEl) => {
    const { children } = virtualDom
    virtualDom.el = parentEl
    children.forEach((child) => mountDOM(child, parentEl))
}

function addProps(el, props, vdom) {
    const { on: events, ...attrs } = props
    vdom.listeners = addEventListeners(events, el)
    setAttributes(el, attrs)
}