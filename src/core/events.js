export const addEvListener = (eventName, handler, el) => {
    const normalizedName = eventName.toLowerCase().replace(/^on/, '');
    el[`on${normalizedName}`] = handler;
    return handler;
};

export const addEvListeners = (listeners = {}, el) => {
    const addedListeners = {};
    Object.entries(listeners).forEach(([eventName, handler]) => {
        const listener = addEvListener(eventName, handler, el);
        addedListeners[eventName] = listener;
    });
    return addedListeners;
};

export const removeEvListeners = (listeners = {}, el) => {
    Object.entries(listeners).forEach(([eventName, handler]) => {
        const normalizedName = eventName.toLowerCase().replace(/^on/, '');
        el[`on${normalizedName}`] = null;
    });
};