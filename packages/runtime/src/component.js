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
        #eventHandlers = null
        #parentComponent = null
        #dispatcher = new Dispatcher()
        #subscriptions = []

        constructor(props = {},
            eventHandlers = {},
            parentComponent = null,
        ) {
            this.props = props
            this.state = state ? state(props) : {}
            this.#eventHandlers = eventHandlers
            this.#parentComponent = parentComponent
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
            mountDOM(this.#vdom, hostEl, index, this)
            this.#wireEventHandlers()

            this.#hostEl = hostEl
            this.#isMounted = true
        }

        unmount() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted')
            }

            destroyDOM(this.#vdom)
            this.#subscriptions.forEach((unsubscribe) => unsubscribe())

            this.#vdom = null
            this.#hostEl = null
            this.#isMounted = false
            this.#subscriptions = []
        }

        updateState(state) {
            this.state = { ...this.state, ...state }
            this.#patch()
        }

        updateProps(props) {
            this.props = { ...this.props, ...props }
            this.#patch()
        }

        emit(eventName, payload) {
            this.#dispatcher.dispatch(eventName, payload)
        }

        #patch() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted')
            }
            const vdom = this.render()
            this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this)
        }

        #wireEventHandlers() {
            this.#subscriptions = Object.entries(this.#eventHandlers).map(
                ([eventName, handler]) =>
                    this.#wireEventHandler(eventName, handler)
            )
        }

        #wireEventHandler(eventName, handler) {
            return this.#dispatcher.subscribe(eventName, (payload) => {
                if (this.#parentComponent) {
                    handler.call(this.#parentComponent, payload)
                } else {
                    handler(payload)
                }
            })
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