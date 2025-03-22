import { h } from "../../../src/core/dom.js";

export function Footer({ activeCount, completedCount, filter }, emit) {
  return h("footer", { class: "footer", "data-testid": "footer" }, [
    h("span", { class: "todo-count" }, [
      `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left!`
    ]),
    h("ul", { class: "filters", "data-testid": "footer-navigation" }, [
      h("li", {}, [
        h("a", { 
          class: filter === 'all' ? "selected" : "", 
          href: "#/" 
        }, ["All"])
      ]),
      h("li", {}, [
        h("a", { 
          class: filter === 'active' ? "selected" : "", 
          href: "#/active" 
        }, ["Active"]),
      ]),
      h("li", {}, [
        h("a", { 
          class: filter === 'completed' ? "selected" : "", 
          href: "#/completed" 
        }, ["Completed"]),
      ]),
    ]),
    h("button", { 
      class: "clear-completed", 
      disabled: completedCount === 0,
      on: {
        click: () => emit("clear-completed")
      }
    }, [
      "Clear completed"
    ]),
  ]);
}
