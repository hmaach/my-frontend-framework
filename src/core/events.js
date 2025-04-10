export function addEvListener(eventName, handler, el, hostComponent = null) {
  function boundHandler() {
    hostComponent
      ? handler.apply(hostComponent, arguments)
      : handler(...arguments);
  }
  el[`on${eventName}`] = handler;
  return boundHandler;
}

export function addEvListeners(listeners = {}, el, hostComponent = null) {
  const addedListeners = {};
  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEvListener(eventName, handler, el, hostComponent);
    addedListeners[eventName] = listener;
  });
  return addedListeners;
}

export function removeEvListeners(listeners = {}, el) {
  Object.entries(listeners).forEach(([eventName]) => {
    el[`on${eventName}`] = null;
  });
}
