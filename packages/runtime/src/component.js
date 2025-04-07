import { destroyDOM } from "./dom_destroying.js"
import { mountDOM } from "./dom_mounting.js"
import { patchDOM } from "./dom_patching.js"
import { extractChildren } from "./h.js"
import { hasOwnProperty } from "./utils/objects.js"


export function defineComponent({ render, state, ...methods }) {
    class Component {
        #isMounted = false
        #vdom = null
        #hostEl = null

        constructor(props = {}) {
            this.props = props
            this.state = state ? state(props) : {}
        }

        get elements() {
            if (this.#vdom == null) {
                return []
            }

            if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
                return extractChildren(this.#vdom).flatMap((child) => {
                    if (child.type === DOM_TYPES.COMPONENT) {
                        return child.component.elements
                    }
                    return [child.el]
                })
            }
        }

        get firstElement() {
            return this.elements[0]
        }

        get offset() {
            if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
                return Array.from(this.#hostEl.children).indexOf(this.firstElement)
            }
            return 0
        }

        render() {
            return render.call(this)
        }

        mount(hostEl, index = null) {
            if (this.#isMounted) {
                throw new Error('Component is already mounted')
            }

            this.#vdom = this.render()
            mountDOM(this.#vdom, hostEl, index)
            this.#hostEl = hostEl
            this.#isMounted = true
        }

        updateState(state) {
            this.state = { ...this.state, ...state }
            this.#patch()
        }

        #patch() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted')
            }
            const vdom = this.render()
            this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this)
        }

        unmount() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted')
            }
            destroyDOM(this.#vdom)
            this.#vdom = null
            this.#hostEl = null
            this.#isMounted = false
        }
    }

    for (const methodName in methods) {
        if (hasOwnProperty(Component, methodName)) {
            throw new Error(`Method "${methodName}()" already exists in the component.`)
        }
        Component.prototype[methodName] = methods[methodName]
    }

    return Component
}