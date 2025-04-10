import { defineComponent, h } from "../../../../src/index.js";
import { Input } from "./Input.js";

export const Header = defineComponent({
  render() {
    return h('header', { 
      className: "header",
      "data-testid": "header"
    }, [
      h('h1', {}, ['todos']),
      h(Input, {
        label: "New Todo Input",
        placeholder: "What needs to be done?",
        on: {
          submit: (title) => this.emit("addItem", { title })
        }
      })
    ]);
  }
});
