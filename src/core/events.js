class SyntheticEvent {
    constructor(nativeEvent) {
        this.nativeEvent = nativeEvent;
        this.target = nativeEvent.target;
        this.currentTarget = nativeEvent.currentTarget;
        this.type = nativeEvent.type;
        this.bubbles = nativeEvent.bubbles;
        this.cancelable = nativeEvent.cancelable;
        this.defaultPrevented = nativeEvent.defaultPrevented;
        this.timeStamp = nativeEvent.timeStamp;
        this._stopPropagation = false;
        this._preventDefault = false;

        if (nativeEvent instanceof KeyboardEvent) {
            this.key = nativeEvent.key;
            this.code = nativeEvent.code;
            this.altKey = nativeEvent.altKey;
            this.ctrlKey = nativeEvent.ctrlKey;
            this.shiftKey = nativeEvent.shiftKey;
            this.metaKey = nativeEvent.metaKey;
        }
    }

    preventDefault() {
        this._preventDefault = true;
        this.defaultPrevented = true;
        this.nativeEvent.preventDefault();
    }

    stopPropagation() {
        this._stopPropagation = true;
        this.nativeEvent.stopPropagation();
    }
}

const EventMap = {
    click: ['onClick', 'click'],
    dblclick: ['onDoubleClick', 'dblclick'],
    input: ['onInput', 'input'],
    change: ['onChange', 'change'],
    submit: ['onSubmit', 'submit'],
    keydown: ['onKeyDown', 'keydown'],
    keyup: ['onKeyUp', 'keyup'],
    keypress: ['onKeyPress', 'keypress'],
    mouseenter: ['onMouseEnter', 'mouseenter'],
    mouseleave: ['onMouseLeave', 'mouseleave'],
    scroll: ['onScroll', 'scroll'],
};

export class EventManager {
    static eventPool = new Map();
    static delegatedEvents = new Set();

    static handleEvent(eventName, handler, el) {
        return (nativeEvent) => {
            const syntheticEvent = EventManager.createSyntheticEvent(nativeEvent);
            handler.call(el, syntheticEvent);
            
            if (syntheticEvent._stopPropagation) {
                nativeEvent.stopPropagation();
            }
        };
    }

    static createSyntheticEvent(nativeEvent) {
        const syntheticEvent = new SyntheticEvent(nativeEvent);
        EventManager.eventPool.set(nativeEvent.type, syntheticEvent);
        return syntheticEvent;
    }

    static setupGlobalEventListener(eventName) {
        if (EventManager.delegatedEvents.has(eventName)) return;

        document.addEventListener(eventName, (e) => {
            const path = e.composedPath();
            for (let element of path) {
                if (!element.dataset) continue;
                const handler = element[`__${eventName}Handler`];
                if (handler) {
                    handler(e);
                    if (e._stopPropagation) break;
                }
            }
        });

        EventManager.delegatedEvents.add(eventName);
    }

    static addEventListener(eventName, handler, el) {
        const wrappedHandler = EventManager.handleEvent(eventName, handler, el);
        const [reactName, domName] = EventMap[eventName] || [eventName, eventName];
        
        el[`__${domName}Handler`] = wrappedHandler;
        EventManager.setupGlobalEventListener(domName);
        
        return wrappedHandler;
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
            const domName = EventMap[eventName]?.[1] || eventName;
            delete el[`__${domName}Handler`];
            el.removeEventListener(eventName, handler);
        });
    }
}

export const { addEventListener, addEventListeners, removeEventListeners } = EventManager;