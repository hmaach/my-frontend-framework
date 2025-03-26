import { h } from "../../../src/core/dom.js";

export function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i;
  let isProcessingEdit = false;

  const handleKeydown = (event) => {
    if (event.key === "Enter" && edit.edited.length >= 2) {
      isProcessingEdit = true;
      emit("save-edited-todo");
    }
  };

  const handleBlur = () => {
    if (!isProcessingEdit) {
      emit("cancel-editing-todo");
    }
  };

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
            keydown: handleKeydown,
            blur: handleBlur,
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
