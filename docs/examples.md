# Mini-Framework Examples

## Basic Usage

### Creating Elements
```javascript
import { h, mountDOM } from 'mini-framework';

// Create a simple element
const element = h('div', { class: 'container' }, [
    h('h1', {}, ['Hello World'])
]);

// Mount to DOM
mountDOM(element, document.getElementById('app'));
```

### Event Handling
```javascript
// Method 1: Using PureEventSystem
const button = h('button', {}, ['Click me']);
window.pureEventSystem.onClick(button, (e) => {
    console.log('Button clicked!');
});

// Method 2: Using props
const button = h('button', {
    onClick: (e) => console.log('Clicked!'),
    onMouseover: (e) => console.log('Mouse over')
}, ['Click me']);
```

### Creating an Application
```javascript
import { createApp } from 'mini-framework';

// Define initial state
const state = {
    count: 0
};

// Define reducers
const reducers = {
    'increment': (state) => ({ ...state, count: state.count + 1 }),
    'decrement': (state) => ({ ...state, count: state.count - 1 })
};

// Create view
const view = (state, emit) => h('div', {}, [
    h('button', { onClick: () => emit('decrement') }, ['-']),
    h('span', {}, [state.count.toString()]),
    h('button', { onClick: () => emit('increment') }, ['+'])
]);

// Create and mount app
const app = createApp({ state, reducers, view });
app.mount(document.getElementById('app'));
```

### Using the Router
```javascript
import { createRouter } from 'mini-framework';

const app = createApp({...});

const router = createRouter(app);

// Routes are automatically handled based on hash changes
// #/ -> defaults to home
// #/active -> active route
// #/completed -> completed route
```

### Element Attributes and Styling
```javascript
const element = h('div', {
    class: ['container', 'main'],
    style: {
        backgroundColor: 'blue',
        fontSize: '16px'
    },
    id: 'main-container',
    'data-test': 'test-value'
}, [
    // Children
]);
```

## Advanced Patterns

### Nested Components
```javascript
const TodoItem = (todo, emit) => h('li', {}, [
    h('span', {}, [todo.text]),
    h('button', { onClick: () => emit('delete', todo.id) }, ['Delete'])
]);

const TodoList = (todos, emit) => h('ul', {}, 
    todos.map(todo => TodoItem(todo, emit))
);
```

### Fragment Usage
```javascript
import { hFragment } from 'mini-framework';

const MultipleElements = () => hFragment([
    h('h1', {}, ['Title']),
    h('p', {}, ['Paragraph 1']),
    h('p', {}, ['Paragraph 2'])
]);
```
