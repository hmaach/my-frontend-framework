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
    
    const originalDocumentClick = document.onclick;
    document.onclick = (event) => {
      if (originalDocumentClick) originalDocumentClick.call(document, event);
      this.triggerHandlers('click', event);
    };
    
    const originalDocumentDblClick = document.ondblclick;
    document.ondblclick = (event) => {
      if (originalDocumentDblClick) originalDocumentDblClick.call(document, event);
      this.triggerHandlers("dblclick", event);
    };

    const originalWindowScroll = window.onscroll;
    window.onscroll = (event) => {
      if (originalWindowScroll) originalWindowScroll.call(window, event);
      this.triggerHandlers('scroll', event);
    };
    
    const originalDocumentKeydown = document.onkeydown;
    document.onkeydown = (event) => {
      if (originalDocumentKeydown) originalDocumentKeydown.call(document, event);
      this.triggerHandlers('keydown', event);
    };
    
    const originalWindowMousemove = window.onmousemove;
    window.onmousemove = (event) => {
      if (originalWindowMousemove) originalWindowMousemove.call(window, event);
      this.triggerHandlers('mousemove', event);
    };
    
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.attachEventPropertiesToElement(node);
              node.querySelectorAll('*').forEach(child => {
                this.attachEventPropertiesToElement(child);
              });
            }
          }
        }
      }
    });
    
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    document.querySelectorAll('*').forEach(el => {
      this.attachEventPropertiesToElement(el);
    });
  }
  
  attachEventPropertiesToElement(element) {
    const eventTypes = ['click', 'mouseover', 'mouseout', 'keydown', 'keyup', 'input', 'change', 'focus', 'blur'];
    
    eventTypes.forEach(type => {
      const propName = `on${type}`;
      const originalHandler = element[propName];
      
      Object.defineProperty(element, propName, {
        get: function() {
          return this[`_${propName}`] || null;
        },
        set: function(newHandler) {
          this[`_${propName}`] = newHandler;
          
          const wrappedHandler = (event) => {
            if (this[`_${propName}`]) {
              this[`_${propName}`].call(this, event);
            }
          };
          
          element[`_wrapped_${propName}`] = wrappedHandler;
        },
        configurable: true
      });
      
      if (originalHandler) {
        element[propName] = originalHandler;
      }
    });
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
