import { defineComponent, h, hFragment } from "../../../../src/index.js";

export const Footer = defineComponent({
    getActiveTodos() {
        return this.props.todos.filter((todo) => !todo.completed);
    },

    render() {
        const { todos, route } = this.props;
        
        if (todos.length === 0) {
            return h('div', {}, [])
        }

        const activeTodos = this.getActiveTodos();

        return h('footer', { 
            className: "footer",
            "data-testid": "footer"
        }, [
            h('span', { className: "todo-count" }, 
                [`${activeTodos.length} ${activeTodos.length === 1 ? "item" : "items"} left!`]
            ),
            h('ul', { 
                className: "filters",
                "data-testid": "footer-navigation"
            }, [
                h('li', {}, [
                    h('a', { 
                        className: route === "/" ? "selected" : "",
                        href: "#/"
                    }, ['All'])
                ]),
                h('li', {}, [
                    h('a', {
                        className: route === "/active" ? "selected" : "",
                        href: "#/active"
                    }, ['Active'])
                ]),
                h('li', {}, [
                    h('a', {
                        className: route === "/completed" ? "selected" : "",
                        href: "#/completed"
                    }, ['Completed'])
                ])
            ]),
            h('button', {
                className: "clear-completed",
                disabled: activeTodos.length === todos.length,
                on: { click: () => this.emit("removeCompleted") }
            }, ['Clear completed'])
        ]);
    }
});
