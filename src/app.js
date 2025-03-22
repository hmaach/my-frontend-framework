import { createApp } from "./core/app.js";
import { h, hString, hFragment } from "./core/dom.js";

const state = {
  currentTodo: "",
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: [],
};

const reducers = {
  "update-current-todo": (state, currentTodo) => ({
    ...state,
    currentTodo,
  }),
  "add-todo": (state) => ({
    ...state,
    currentTodo: "",
    todos: [...state.todos, { text: state.currentTodo, completed: false }],
  }),
  "start-editing-todo": (state, idx) => {
    setTimeout(() => {
      const input = document.querySelector('[data-testid="todo-item-edit-input"]');
      if (input) input.focus();
    }, 0);
    
    return {
      ...state,
      edit: {
        idx,
        original: state.todos[idx].text,
        edited: state.todos[idx].text,
      },
    };
  },
  "edit-todo": (state, edited) => ({
    ...state,
    edit: { ...state.edit, edited },
  }),
  "save-edited-todo": (state) => {
    const todos = [...state.todos];
    todos[state.edit.idx].text = state.edit.edited;
    return {
      ...state,
      edit: { idx: null, original: null, edited: null },
      todos,
    };
  },
  "cancel-editing-todo": (state) => ({
    ...state,
    edit: { idx: null, original: null, edited: null },
  }),
  "remove-todo": (state, idx) => ({
    ...state,
    todos: state.todos.filter((_, i) => i !== idx),
  }),
  "toggle-todo": (state, idx) => {
    const todos = [...state.todos];
    todos[idx].completed = !todos[idx].completed;
    return {
      ...state,
      todos,
    };
  },
  "toggle-all-todos": (state) => {
    const areAllCompleted = state.todos.every(todo => todo.completed);
    const todos = state.todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted
    }));
    return {
      ...state,
      todos
    };
  },
  "clear-completed": (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  }),
};

function App(state, emit) {
  const hasTodos = state.todos.length > 0;
  const activeCount = state.todos.filter(todo => !todo.completed).length;
  const completedCount = state.todos.length - activeCount;
  const areAllCompleted = state.todos.length > 0 && activeCount === 0;

  return hFragment([
    h("section", { class: "todoapp", id: "root" }, [
      h("header", { class: "header", "data-testid": "header" }, [
        h("h1", {}, ["todos"]),
        h("div", { class: "input-container" }, [CreateTodo(state, emit)]),
      ]),
      h("main", { class: "main", "data-testid": "main" }, [
        h("div", { class: "toggle-all-container" }, [
          h("input", {
            class: "toggle-all",
            type: "checkbox",
            id: "toggle-all",
            checked: areAllCompleted,
            "data-testid": "toggle-all",
          }),
          h("label", { 
            class: "toggle-all-label", 
            for: "toggle-all",
            on: {
              click: () => emit("toggle-all-todos")
            }
          }, [
            "Toggle All Input",
          ]),
        ]),
        TodoList(state, emit),
      ]),
      hasTodos
        ? h("footer", { class: "footer", "data-testid": "footer" }, [
            h("span", { class: "todo-count" }, [
              `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left!`
            ]),
            h("ul", { class: "filters", "data-testid": "footer-navigation" }, [
              h("li", {}, [h("a", { class: "selected", href: "#/" }, ["All"])]),
              h("li", {}, [
                h("a", { class: "", href: "#/active" }, ["Active"]),
              ]),
              h("li", {}, [
                h("a", { class: "", href: "#/completed" }, ["Completed"]),
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
          ])
        : null,
    ]),
    h("footer", { class: "info" }, [
      h("p", {}, ["Double-click to edit a todo"]),
      h("p", {}, ["Created by the TodoMVC Team"]),
      h("p", {}, [
        "Part of ",
        h("a", { href: "http://todomvc.com" }, ["TodoMVC"]),
      ]),
    ]),
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

function TodoList({ todos, edit }, emit) {
  return h(
    "ul",
    { class: "todo-list", "data-testid": "todo-list" },
    todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
  );
}

function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i;

  return h(
    "li",
    { class: `${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`, "data-testid": "todo-item" },
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
              click: () => emit("toggle-todo", i),
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

createApp({ state, reducers, view: App }).mount(document.body);
