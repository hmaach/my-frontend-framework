class PureEventSystem {
  constructor() {
    this.handlers = {};
    this.handlerIds = {};
    this.setupEventCapture();
  }
  
  setupEventCapture() {
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    
    EventTarget.prototype.dispatchEvent = function(event) {
      PureEventSystem.processEvent(event, this);
      return originalDispatchEvent.call(this, event);
    };
    
    const globalEvents = {
      document: ['click', 'dblclick', 'keydown', 'keyup', 'mousedown', 'mouseup', 'contextmenu'],
      window: ['scroll', 'resize', 'mousemove', 'blur', 'focus', 'popstate']
    };
    
    globalEvents.document.forEach(eventType => {
      const originalHandler = document[`on${eventType}`];
      document[`on${eventType}`] = (event) => {
        if (originalHandler) originalHandler.call(document, event);
        this.triggerHandlers(eventType, event);
      };
    });
    
    globalEvents.window.forEach(eventType => {
      const originalHandler = window[`on${eventType}`];
      window[`on${eventType}`] = (event) => {
        if (originalHandler) originalHandler.call(window, event);
        this.triggerHandlers(eventType, event);
      };
    });
    
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewElement(node);
            }
          });
        } else if (mutation.type === 'attributes' && mutation.attributeName.startsWith('on')) {
          this.updateElementEventHandler(mutation.target, mutation.attributeName);
        }
      }
    });
    
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [/^on.+/]
    });
    
    this.processAllExistingElements();
  }

  processNewElement(element) {
    this.attachEventPropertiesToElement(element);
    
    if (element.children && element.children.length) {
      Array.from(element.children).forEach(child => {
        this.processNewElement(child);
      });
    }
    
    const newElementEvent = new CustomEvent('element:added', { 
      detail: { element },
      bubbles: true
    });
    element.dispatchEvent(newElementEvent);
  }

  processAllExistingElements() {
    document.querySelectorAll('*').forEach(element => {
      this.attachEventPropertiesToElement(element);
    });
  }

  updateElementEventHandler(element, attributeName) {
    const eventType = attributeName.slice(2);
    const handlerValue = element.getAttribute(attributeName);
    
    if (handlerValue) {
      try {
        const handlerFn = new Function('event', handlerValue);
        PureEventSystem.registerHandler(element, eventType, handlerFn);
      } catch (e) {
        console.warn(`Failed to parse handler for ${attributeName}:`, e);
      }
    } else {
      PureEventSystem.unregisterHandler(element, eventType);
    }
  }

  attachEventPropertiesToElement(element) {
    const elementEvents = [
      'click', 'dblclick', 'mouseenter', 'mouseleave', 
      'focus', 'blur', 'input', 'change', 'submit'
    ];
    
    elementEvents.forEach(eventType => {
      const handlerPropertyName = `on${eventType}`;
      const originalHandler = element[handlerPropertyName];
      
      Object.defineProperty(element, handlerPropertyName, {
        get: function() {
          return this._pureEventHandlers?.[eventType] || null;
        },
        set: function(newHandler) {
          if (!this._pureEventHandlers) this._pureEventHandlers = {};
          this._pureEventHandlers[eventType] = newHandler;
          
          if (newHandler) {
            PureEventSystem.registerHandler(this, eventType, newHandler);
          } else {
            PureEventSystem.unregisterHandler(this, eventType);
          }
        },
        configurable: true
      });
      
      if (originalHandler) {
        element[handlerPropertyName] = originalHandler;
      }
      
      const attrHandler = element.getAttribute(handlerPropertyName);
      if (attrHandler && !originalHandler) {
        try {
          element[handlerPropertyName] = new Function('event', attrHandler);
        } catch (e) {
          console.warn(`Failed to parse handler for ${handlerPropertyName}:`, e);
        }
      }
    });
  }

  static registerHandler(element, eventType, handler) {
    if (!element._pureEventHandlers) {
      element._pureEventHandlers = {};
    }
    element._pureEventHandlers[eventType] = handler;
  }

  static unregisterHandler(element, eventType) {
    if (element._pureEventHandlers) {
      delete element._pureEventHandlers[eventType];
    }
  }

  static processEvent(event, target) {
    if (window.pureEventSystem) {
      window.pureEventSystem.triggerHandlers(event.type, event);
    }
  }
  
  triggerHandlers(eventType, event) {
    if (!this.handlers[eventType]) return;
    
    for (const handler of this.handlers[eventType]) {
      let shouldTrigger = false;
      
      if (handler.selector) {
        const elements = document.querySelectorAll(handler.selector);
        const targetElement = event.target;
        
        for (const element of elements) {
          if (element === targetElement || element.contains(targetElement)) {
            shouldTrigger = true;
            break;
          }
        }
      } else {
        shouldTrigger = true;
      }
      
      if (shouldTrigger) {
        if (handler.options.preventDefault) {
          event.preventDefault();
        }
        
        if (handler.options.stopPropagation) {
          event.stopPropagation();
        }
        
        handler.callback(event);
      }
    }
  }
  
  on(eventType, selectorOrCallback, callbackOrOptions, optionsObj = {}) {
    let selector = null;
    let callback = null;
    let options = optionsObj;
    
    if (typeof selectorOrCallback === 'function') {
      callback = selectorOrCallback;
      options = callbackOrOptions || {};
    } else {
      selector = selectorOrCallback;
      callback = callbackOrOptions;
    }
    
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
    
    this.handlers[eventType].push({
      id,
      selector,
      callback,
      options
    });
    
    if (!this.handlerIds[eventType]) {
      this.handlerIds[eventType] = [];
    }
    this.handlerIds[eventType].push(id);
    
    return id;
  }
  
  off(eventType, selectorOrId, callback) {
    if (!this.handlers[eventType]) {
      return false;
    }
    
    if (typeof selectorOrId === 'string' && !callback) {
      const id = selectorOrId;
      const index = this.handlers[eventType].findIndex(h => h.id === id);
      
      if (index !== -1) {
        this.handlers[eventType].splice(index, 1);
        
        const idIndex = this.handlerIds[eventType].indexOf(id);
        if (idIndex !== -1) {
          this.handlerIds[eventType].splice(idIndex, 1);
        }
        
        return true;
      }
    } 
    else if (selectorOrId && callback) {
      const selector = selectorOrId;
      let removed = false;
      
      for (let i = this.handlers[eventType].length - 1; i >= 0; i--) {
        const handler = this.handlers[eventType][i];
        
        if (handler.selector === selector && handler.callback === callback) {
          const idIndex = this.handlerIds[eventType].indexOf(handler.id);
          if (idIndex !== -1) {
            this.handlerIds[eventType].splice(idIndex, 1);
          }
          
          this.handlers[eventType].splice(i, 1);
          removed = true;
        }
      }
      
      return removed;
    }
    else if (!selectorOrId && !callback) {
      delete this.handlers[eventType];
      delete this.handlerIds[eventType];
      return true;
    }
    
    return false;
  }
  
  onClick(selectorOrCallback, callbackOrOptions, options = {}) {
    return this.on('click', selectorOrCallback, callbackOrOptions, options);
  }
  
  onScroll(selectorOrCallback, callbackOrOptions, options = {}) {
    return this.on('scroll', selectorOrCallback, callbackOrOptions, options);
  }
  
  onKeydown(selectorOrCallback, callbackOrOptions, options = {}) {
    return this.on('keydown', selectorOrCallback, callbackOrOptions, options);
  }
  
  onMousemove(selectorOrCallback, callbackOrOptions, options = {}) {
    return this.on('mousemove', selectorOrCallback, callbackOrOptions, options);
  }
  
  onKey(key, callback, options = {}) {
    return this.on('keydown', (event) => {
      if (event.key === key) {
        callback(event);
      }
    }, options);
  }
  
  destroy() {
    this.observer.disconnect();
    this.handlers = {};
    this.handlerIds = {};
  }
}

window.pureEventSystem = new PureEventSystem();
