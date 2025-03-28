import { mountDOM } from "./mount-dom.js";
import { destroyDOM } from "./destroy-dom.js";
import { h } from "./dom.js";
import { NoopRouter } from "./router.js";

export function createApp(RootComponent, props = {}, options = {}) {
  let parentEl = null;
  let isMounted = false;
  let vdom = null;

  const context = {
    router: options.router || new NoopRouter(),
  };

  function reset() {
    parentEl = null;
    isMounted = false;
    vdom = null;
  }
  return {
    mount(_parentEl) {
      if (isMounted) {
        throw new Error("The application is already mounted");
      }
      parentEl = _parentEl;
      vdom = h(RootComponent, props);
      mountDOM(vdom, parentEl, null, { appContext: context });

      context.router.init();
      isMounted = true;
    },
    unmount() {
      if (!isMounted) {
        throw new Error("The application is not mounted");
      }
      destroyDOM(vdom);
      context.router.destroy();
      reset();
    },
  };
}
