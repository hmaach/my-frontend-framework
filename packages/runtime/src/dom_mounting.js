import { setAttributes } from './attrs.js'
import { addEventListeners } from './events.js'
import { DOM_TYPES } from './h.js'
import { extractPropsAndEvents } from './utils/props.js'

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

function createComponentNode(vdom, parentEl, index, hostComponent) {
    const Component = vdom.tag
    const { props, events } = extractPropsAndEvents(vdom)
    const component = new Component(props, events, hostComponent)

    component.mount(parentEl, index)
    vdom.component = component
    vdom.el = component.firstElement
}

const createElementNode = (virtualDom, parentElement, index, hostComponent) => {
    const { tag, children } = vdom

    const ElementNode = document.createElement(tag)
    addProps(element, vdom, hostComponent)
    virtualDom.el = ElementNode

    children.forEach((child) => mountDOM(child, ElementNode, null, hostComponent))
    insert(ElementNode, parentElement, index)
}

const createTextNode = (virtualDom, parentElement, index) => {
    const textNode = document.createTextNode(virtualDom.value)
    virtualDom.el = textNode
    insert(textNode, parentElement, index)
}

function createFragmentNodes(
    vdom,
    parentEl,
    index,
    hostComponent
) {
    const { children } = vdom
    vdom.el = parentEl
    children.forEach((child) =>
        mountDOM(child, parentEl, index ? index + i : null, hostComponent)
    )
}

function addProps(el, vdom, hostComponent) {
    const { props: attrs, events } = extractPropsAndEvents(vdom)

    vdom.listeners = addEventListeners(events, el, hostComponent)
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