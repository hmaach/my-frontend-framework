export const state = {
  currentTodo: "",
  filter: "all",
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: [],
};

export const reducers = {
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
  "set-filter": (state, filter) => ({
    ...state,
    filter
  }),
};
