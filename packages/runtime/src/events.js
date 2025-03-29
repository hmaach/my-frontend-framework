export const addEventListeners = (listeners = {}, el) => {
    Object.entries(listeners)
        .forEach(([eventName, handler]) =>
            addEventListener(eventName, handler, el))
    return listeners
}

const addEventListener = (event, handler, el) => {
    el.addEventListener(event, handler)
    return handler
}

// {
//     click: () => { ... },
//     }
// el.removeEventListener('click', listeners['click'])

export const removeEventListeners = (listeners = {}, el) => {
    Object.entries(listeners).forEach(([eventName, handler]) => {
        el.removeEventListener(eventName, handler)
    })
}