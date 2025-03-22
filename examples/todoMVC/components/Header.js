import { h } from "../../../src/core/dom.js";

export function Header(state, emit) {
  return h("header", { class: "header", "data-testid": "header" }, [
    h("h1", {}, ["todos"]),
    h("div", { class: "input-container" }, [CreateTodo(state, emit)]),
  ]);
}

function CreateTodo({ currentTodo }, emit) {
  return h("div", {}, [
    h("input", {
      class: "new-todo",
      id: "todo-input",
      type: "text",
      "data-testid": "text-input",
      placeholder: "What needs to be done?",
      value: currentTodo,
      on: {
        input: ({ target }) => emit("update-current-todo", target.value),
        keydown: ({ key }) => {
          if (key === "Enter" && currentTodo.length >= 2) {
            emit("add-todo");
          }
        },
      },
    }),
    h("label", { class: "visually-hidden", for: "todo-input" }, [
      "New Todo Input",
    ]),
  ]);
}
