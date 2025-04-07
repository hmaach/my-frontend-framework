import {
  defineComponent,
  h,
  hFragment,
  HashRouter,
  addEvListener,
} from "../../../src/index.js";
import { Header } from "./components/Header.js";
import { TodoList } from "./components/TodoList.js";
import { Footer } from "./components/Footer.js";

const generateId = () => Math.random().toString(36).substring(2);

const router = new HashRouter([
  { path: "/", component: null },
  { path: "/active", component: null },
  { path: "/completed", component: null },
]);

export const App = defineComponent({
  state: () => ({
    todos: [],
    route: window.location.hash.slice(1) || "/",
  }),

  onMounted() {
    router.init();
    addEvListener(
      "hashchange",
      () => {
        const newRoute = window.location.hash.slice(1) || "/";
        this.updateState({ route: newRoute });
      },
      window
    );
  },

  addItem({ title }) {
    const newTodo = {
      id: generateId(),
      title,
      completed: false,
    };
    this.updateState({ todos: [...this.state.todos, newTodo] });
  },

  toggleItem({ id }) {
    const todos = this.state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.updateState({ todos });
  },

  toggleAll({ completed }) {
    const todos = this.state.todos.map((todo) => ({ ...todo, completed }));
    this.updateState({ todos });
  },

  removeItem({ id }) {
    const todos = this.state.todos.filter((todo) => todo.id !== id);
    this.updateState({ todos });
  },

  updateItem({ id, title }) {
    const todos = this.state.todos.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    );
    this.updateState({ todos });
  },

  removeCompleted() {
    const todos = this.state.todos.filter((todo) => !todo.completed);
    this.updateState({ todos });
  },

  render() {
    const { todos, route } = this.state;

    return hFragment([
      h("section", { className: "todoapp", id: "root" }, [
        h(Header, {
          on: {
            addItem: (payload) => this.addItem(payload),
          },
        }),
        h(TodoList, {
          todos,
          route,
          on: {
            toggleItem: (payload) => this.toggleItem(payload),
            toggleAll: (payload) => this.toggleAll(payload),
            removeItem: (payload) => this.removeItem(payload),
            updateItem: (payload) => this.updateItem(payload),
          },
        }),
        h(Footer, {
          todos,
          route,
          on: {
            removeCompleted: () => this.removeCompleted(),
          },
        }),
      ]),
      h("footer", { className: "info" }, [
        h("p", {}, ["Double-click to edit a todo"]),
        h("p", {}, [
          "Created by ",
          h("a", { href: "https://github.com/khlifihamza" }, ["khlifi hamza"]),
        ]),
        h("p", {}, [
          "Part of ",
          h("a", { href: "http://todomvc.com" }, ["TodoMVC"]),
        ]),
      ]),
    ]);
  },
});
