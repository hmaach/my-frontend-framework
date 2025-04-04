export class Dispatcher {
    #subs = new Map()
    #afterHandlers = []

    subscribe(commandName, handler) {
        // Creates the array of subscriptions if it doesn’t exist for a given Icommand name
        if (!this.#subs.has(commandName)) {
            this.#subs.set(commandName, [])
        }

        // Checks whether the handler is registered 
        const handlers = this.#subs.get(commandName)
        if (handlers.includes(handler)) {
            return () => { }
        }

        // Registers the handler
        handlers.push(handler)

        // Returns a function to unregister the handler
        return () => {
            const idx = handlers.indexOf(handler)
            handlers.splice(idx, 1)
        }
    }

    afterEveryCommand(handler) {
        // Registers the handler
        this.#afterHandlers.push(handler)
        return () => {
            const idx = this.#afterHandlers.indexOf(handler)
            this.#afterHandlers.splice(idx, 1)
        }
    }

    dispatch(commandName, payload) {
        if (this.#subs.has(commandName)) {
            this.#subs.get(commandName).forEach((handler) => handler(payload))
        } else {
            console.warn(`No handlers for command: ${commandName}`)
        }
        this.#afterHandlers.forEach((handler) => handler())
    }
}