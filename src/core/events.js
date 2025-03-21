export const addEventListener = (eventName, handler, el) => {
    const normalizedName = eventName.toLowerCase().replace(/^on/, '');
    el[`on${normalizedName}`] = handler;
    return handler;
};

export const addEventListeners = (listeners = {}, el) => {
    const addedListeners = {};
    Object.entries(listeners).forEach(([eventName, handler]) => {
        const listener = addEventListener(eventName, handler, el);
        addedListeners[eventName] = listener;
    });
    return addedListeners;
};

export const removeEventListeners = (listeners = {}, el) => {
    Object.entries(listeners).forEach(([eventName, handler]) => {
        const normalizedName = eventName.toLowerCase().replace(/^on/, '');
        el[`on${normalizedName}`] = null;
    });
};