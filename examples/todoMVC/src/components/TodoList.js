import { defineComponent, h } from "../../../../src/index.js";
import { TodoItem } from "./TodoItem.js";

export const TodoList = defineComponent({
    filterTodos(todos, route) {
        const currentRoute = route === "/" ? route : route.slice(1);
        
        switch (currentRoute) {
            case "active":
                return todos.filter(todo => !todo.completed);
            case "completed":
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    },

    render() {
        const { todos, route } = this.props;
        const visibleTodos = this.filterTodos(todos, route);
        const allCompleted = visibleTodos.length > 0 && visibleTodos.every((todo) => todo.completed);

        return h('main', {
            className: "main",
            "data-testid": "main"
        }, [
            todos.length > 0 && visibleTodos.length > 0 ? h('div', { className: "toggle-all-container" }, [
                h('input', {
                    className: "toggle-all",
                    type: "checkbox",
                    id: "toggle-all",
                    "data-testid": "toggle-all",
                    checked: allCompleted,
                    on: {
                        change: (e) => this.emit("toggleAll", { completed: e.target.checked })
                    }
                }),
                h('label', {
                    className: "toggle-all-label",
                    htmlFor: "toggle-all"
                }, ['Toggle All Input'])
            ]) : null,
            h('ul', {
                className: "todo-list",
                "data-testid": "todo-list"
            }, visibleTodos.map((todo) => 
                h(TodoItem, {
                    key: todo.id,
                    todo,
                    on: {
                        toggleItem: (payload) => this.emit("toggleItem", payload),
                        removeItem: (payload) => this.emit("removeItem", payload),
                        updateItem: (payload) => this.emit("updateItem", payload)
                    }
                })
            ))
        ]);
    }
});
