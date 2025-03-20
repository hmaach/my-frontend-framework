export class EventManager {
    static addEventListener(eventName, handler, el) {
        el.addEventListener(eventName, handler);
        return handler;
    }

    static addEventListeners(listeners = {}, el) {
        const addedListeners = {};
        Object.entries(listeners).forEach(([eventName, handler]) => {
            const listener = EventManager.addEventListener(eventName, handler, el);
            addedListeners[eventName] = listener;
        });
        return addedListeners;
    }

    static removeEventListeners(listeners = {}, el) {
        Object.entries(listeners).forEach(([eventName, handler]) => {
            el.removeEventListener(eventName, handler);
        });
    }
}

export const { addEventListener, addEventListeners, removeEventListeners } = EventManager;