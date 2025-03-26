import { addEvListener, removeEvListeners } from "./events.js";

export function createRouter(app, routes = {}) {
  if (!app || typeof app.emit !== "function") {
    throw new Error("Router requires an app instance with an emit function");
  }

  function handleRoute() {
    const hash = window.location.hash || "#/";
    const route = routes[hash];
    if (route) route(app);
  }

  const handler = addEvListener("popstate", handleRoute, window);

  handleRoute();

  return {
    destroy: () => removeEvListeners({ popstate: handler }, window),
  };
}
