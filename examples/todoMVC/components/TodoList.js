import { h } from "../../../src/core/dom.js";
import { TodoItem } from "./TodoItem.js";

export function TodoList({ todos, edit, filter }, emit) {
  return h(
    "ul",
    { class: "todo-list", "data-testid": "todo-list" },
    todos.map(todo => TodoItem({ 
      todo: todo, 
      i: todo.index,
      edit 
    }, emit))
  );
}
