import { createApp } from "../../src/core/app.js";
import { h, hFragment } from "../../src/core/dom.js";
import { createRouter } from "../../src/core/router.js";
import { state, reducers } from "./store/store.js";
import { Header } from "./components/Header.js";
import { TodoList } from "./components/TodoList.js";
import { Footer } from "./components/Footer.js";
import { routes } from './routes/routes.js';

function App(state, emit) {
  const hasTodos = state.todos.length > 0;
  const filteredTodos = state.todos
    .map((todo, index) => ({ ...todo, index }))
    .filter(todo => {
      if (state.filter === 'active') return !todo.completed;
      if (state.filter === 'completed') return todo.completed;
      return true;
    });
  const activeCount = state.todos.filter(todo => !todo.completed).length;
  const completedCount = state.todos.length - activeCount;
  const areAllCompleted = state.todos.length > 0 && activeCount === 0;

  return hFragment([
    h("section", { class: "todoapp", id: "root" }, [
      Header(state, emit),
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
        TodoList({ todos: filteredTodos, edit: state.edit, filter: state.filter }, emit),
      ]),
      hasTodos ? Footer({ 
        activeCount, 
        completedCount, 
        filter: state.filter 
      }, emit) : null,
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

const app = createApp({ state, reducers, view: App });
createRouter(app, routes);
app.mount(document.body);
