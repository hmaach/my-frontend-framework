import { defineComponent, h } from "../../../../src/index.js";

const sanitize = (string) => {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
};

const hasValidMin = (value, min) => {
    return value.length >= min;
};

export const Input = defineComponent({
    state() {
        return {
            isEditing: false
        };
    },

    handleSubmit(e) {
        const value = e.target.value.trim();
        if (!hasValidMin(value, 2)) return;
        
        this.emit("submit", sanitize(value));
        e.preventDefault();
        if (!this.props.isEditMode) {
            e.target.value = '';
        }
    },

    render() {
        const inputId = this.props.isEditMode ? "todo-edit-input" : "todo-input";
        return h('div', { className: "input-container" }, [
            h('input', {
                className: 'new-todo',
                id: inputId,
                type: "text",
                "data-testid": this.props.isEditMode ? "todo-item-edit-input" : "text-input",
                autoFocus: true,
                placeholder: this.props.placeholder,
                value: this.props.defaultValue || '',
                on: {
                    blur: (e) => {
                        if (this.props.onBlur) {
                            this.props.onBlur(e);
                        }
                    },
                    keydown: (e) => {
                        if (e.key === "Enter") {
                            const value = e.target.value.trim();
                            if (hasValidMin(value, 2)) {
                                this.emit("submit", sanitize(value));
                                if (this.props.isEditMode) {
                                    e.target.blur();
                                } else {
                                    e.target.value = '';
                                }
                            }
                        } else if (e.key === "Escape" && this.props.isEditMode) {
                            e.target.blur();
                        }
                    }
                }
            }),
            h('label', {
                className: "visually-hidden",
                htmlFor: inputId
            }, [this.props.label])
        ]);
    }
});
