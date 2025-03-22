import { h } from "../../../src/core/dom.js";

export function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i;

  return h(
    "li",
    { 
      class: `${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`,
      "data-testid": "todo-item" 
    },
    [
      isEditing ? 
        h("input", {
          class: "new-todo",
          type: "text",
          "data-testid": "todo-item-edit-input",
          value: edit.edited,
          on: {
            input: ({ target }) => emit("edit-todo", target.value),
            keydown: ({ key }) => {
              if (key === "Enter" && edit.edited.length >= 2) {
                emit("save-edited-todo");
              }
            },
            blur: () => emit("cancel-editing-todo"),
          },
        })
      : h("div", { class: "view" }, [
          h("input", {
            class: "toggle",
            type: "checkbox",
            "data-testid": "todo-item-toggle",
            checked: todo.completed,
            on: {
              click: () => emit("toggle-todo", i)
            },
          }),
          h(
            "label",
            {
              "data-testid": "todo-item-label",
              on: {
                dblclick: () => emit("start-editing-todo", i),
              },
            },
            [todo.text]
          ),
          h("button", { 
            class: "destroy", 
            "data-testid": "todo-item-button",
            on: {
              click: () => emit("remove-todo", i)
            }
          }),
        ]),
    ]
  );
}
