import { Dispatcher } from './dispatcher.js'
import { mountDOM } from './dom_mounting.js'
import { destroyDOM } from './dom_destroying.js'
import { patchDOM } from './dom_patching.js'


export function createApp({ state, view, reducers = {} }) {
    let parentEl = null
    let vdom = null

    const dispatcher = new Dispatcher()
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

    // allow the components to dispatch commands
    function emit(eventName, payload) {
        dispatcher.dispatch(eventName, payload)
    }

    for (const actionName in reducers) {
        const reducer = reducers[actionName]
        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload)
        })
        subscriptions.push(subs)
    }

    // The function that creates the application object
    function renderApp() {
        const newVdom = view(state, emit)
        vdom = patchDOM(vdom, newVdom, parentEl)
    }

    return {
        // Method to mount the application in the DOM
        mount(_parentEl) {
            parentEl = _parentEl
            vdom = view(state, emit)
            mountDOM(vdom, parentEl)
        },

        // Method to unmount the application in the DOM
        unmount() {
            destroyDOM(vdom)
            vdom = null
            subscriptions.forEach((unsubscribe) => unsubscribe())
        },
    }
}