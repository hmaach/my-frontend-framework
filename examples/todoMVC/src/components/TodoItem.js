import { defineComponent, h } from "../../../../src/index.js";
import { Input } from "./Input.js";

export const TodoItem = defineComponent({
    state() {
        return {
            isWritable: false
        };
    },

    setWritable(value) {
        this.updateState({ isWritable: value });
    },

    handleDoubleClick() {
        this.setWritable(true);
        setTimeout(() => {
            const input = document.querySelector('[data-testid="todo-item-edit-input"]');
            if (input) input.focus();
        }, 0);
    },

    handleBlur(e) {
        if (this.state.isWritable) {
            this.setWritable(false);
        }
    },

    handleUpdate(title) {
        if (title.length === 0) {
            this.emit("removeItem", { id: this.props.todo.id });
        } else {
            this.emit("updateItem", { id: this.props.todo.id, title });
        }
    },

    render() {
        const { todo } = this.props;
        const { isWritable } = this.state;

        const content = isWritable ? [
            h(Input, {
                label: "Edit Todo Input",
                defaultValue: todo.title,
                isEditMode: true,
                onBlur: (e) => this.handleBlur(e),
                on: {
                    submit: (title) => this.handleUpdate(title)
                }
            })
        ] : [
            h('input', {
                className: "toggle",
                type: "checkbox",
                "data-testid": "todo-item-toggle",
                checked: todo.completed,
                on: {
                    change: () => this.emit("toggleItem", { id: todo.id })
                }
            }),
            h('label', {
                "data-testid": "todo-item-label",
                on: {
                    dblclick: () => this.handleDoubleClick()
                }
            }, [todo.title]),
            h('button', {
                className: "destroy",
                "data-testid": "todo-item-button",
                on: {
                    click: () => this.emit("removeItem", { id: todo.id })
                }
            })
        ];

        return h('li', {
            className: todo.completed ? "completed" : "",
            "data-testid": "todo-item"
        }, [
            h('div', { className: "view" }, content)
        ]);
    }
});
