export const addEventListeners = (listeners = {}, el) => {
    Object.entries(listeners)
        .forEach(([eventName, handler]) =>
            addEventListener(eventName, handler, el))
    return listeners
}

export const addEventListener = (event, handler, el) => {
    el.addEventListener(event, handler)
    return handler
}

export const removeEventListeners = (listeners = {}, el) => {
    Object.entries(listeners).forEach(([eventName, handler]) => {
        el.removeEventListener(eventName, handler)
    })
}