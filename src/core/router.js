import { makeRouteMatcher } from "./route-matchers.js";
import { addEvListener } from "./events.js";

export class HashRouter {
  #matchers = [];
  #isInitialized = false;
  #onPopState = () => this.#matchCurrentRoute();
  #matchedRoute = null;
  #params = {};
  #query = {};

  constructor(routes = []) {
    this.#matchers = routes.map(makeRouteMatcher);
  }

  get #currentRouteHash() {
    const hash = document.location.hash;

    if (hash === "") {
      return "/";
    }

    return hash.slice(1);
  }

  get matchedRoute() {
    return this.#matchedRoute;
  }

  get params() {
    return this.#params;
  }

  get query() {
    return this.#query;
  }

  async init() {
    if (this.#isInitialized) {
      return;
    }

    if (document.location.hash === "") {
      window.history.replaceState({}, "", "#/");
    }
    addEvListener("popstate", this.#onPopState, window);
    await this.#matchCurrentRoute();

    this.#isInitialized = true;
  }

  destroy() {
    if (!this.#isInitialized) {
      return;
    }
    window.removeEventListener("popstate", this.#onPopState);
    this.#isInitialized = false;
  }

  async navigateTo(path) {
    const matcher = this.#matchers.find((matcher) => matcher.checkMatch(path));

    if (matcher == null) {
      console.warn(`[Router] No route matches path "${path}"`);

      this.#matchedRoute = null;
      this.#params = {};
      this.#query = {};

      return;
    }
    if (matcher.isRedirect) {
      return this.navigateTo(matcher.route.redirect);
    }
    this.#matchedRoute = matcher.route;
    this.#params = matcher.extractParams(path);
    this.#query = matcher.extractQuery(path);
    this.#pushState(path);
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  #matchCurrentRoute() {
    return this.navigateTo(this.#currentRouteHash);
  }

  #pushState(path) {
    window.history.pushState({}, "", `#${path}`);
  }
}

export class NoopRouter {
  init() {}
  destroy() {}
  navigateTo() {}
  back() {}
  forward() {}
  subscribe() {}
  unsubscribe() {}
}
