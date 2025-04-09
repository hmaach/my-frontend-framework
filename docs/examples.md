# mini-framework Framework

mini-framework is a lightweight JavaScript framework for building reactive user interfaces with a simple state management system.

## Features

- Virtual DOM implementation
- State management with reducers
- Component-based architecture
- Event handling system
- No dependencies
- Small footprint (~5KB minified)

## Installation

You can use mini-framework directly via CDN:

```html
<script type="module">
  import { createApp, h, hString, hFragment } from 'https://unpkg.com/mini-framework@latest'
</script>
```

## Basic Usage

Here's a simple counter example:

```javascript
import { createApp, h, hFragment } from 'mini-framework'

// Define initial state
const state = { count: 0 }

// Define reducers
const reducers = {
  "increment": (state) => ({ ...state, count: state.count + 1 }),
  "decrement": (state) => ({ ...state, count: state.count - 1 })
}

// Create view component
function Counter(state, emit) {
  return hFragment([
    h('button', { on: { click: () => emit('decrement') }}, ['-']),
    h('span', {}, [state.count]),
    h('button', { on: { click: () => emit('increment') }}, ['+'])
  ])
}

// Mount the app
createApp({ state, reducers, view: Counter }).mount(document.body)
```

## Core Concepts

### Virtual DOM Elements

The framework provides three main functions for creating virtual DOM elements:

- `h(tag, props, children)`: Creates an element node
- `hString(text)`: Creates a text node
- `hFragment(nodes)`: Creates a fragment containing multiple nodes

```javascript
// Element example
h('div', { class: 'container' }, [
  h('h1', {}, ['Hello World'])
])

// Fragment example
hFragment([
  h('h1', {}, ['Title']),
  h('p', {}, ['Content'])
])
```

### State Management

State is managed through reducers that are pure functions taking the current state and returning a new state:

```javascript
const reducers = {
  "update-value": (state, newValue) => ({
    ...state,
    value: newValue
  })
}
```

### Event Handling

Events are handled through the `on` prop and emit actions to reducers:

```javascript
h('input', {
  value: state.value,
  on: {
    input: (e) => emit('update-value', e.target.value)
  }
})
```

### Component Creation

Components are functions that receive state and emit function:

```javascript
import { createApp, h, hFragment } from 'mini-framework';

const Counter = defineComponent({
  state() {
    return { count: 0 };
  },

  onMounted() {
    console.log('Counter mounted');
  },

  increment() {
    this.updateState({ count: this.state.count + 1 });
  },

  render() {
    return h('div', {}, [
      h('span', {}, [`Count: ${this.state.count}`]),
      h('button', {
        on: { click: () => this.increment() }
      }, ['Increment'])
    ]);
  }
});
```

## Advanced Features

### Attributes and Styling

```javascript
h('div', {
  class: ['container', 'active'],
  style: {
    backgroundColor: 'red',
    fontSize: '16px'
  }
}, [
  // children
])
```

### Conditional Rendering

```javascript
function ConditionalComponent(state, emit) {
  return h('div', {}, [
    state.isVisible 
      ? h('p', {}, ['Visible'])
      : null
  ])
}
```

### List Rendering

```javascript
function ListView({ items }, emit) {
  return h('ul', {}, 
    items.map((item, index) => 
      h('li', { key: index }, [item])
    )
  )
}
```

### Routing

mini-framework provides a built-in HashRouter for client-side routing. The router uses URL hashes (#) for navigation and supports route parameters.

```javascript
import { createApp, h, HashRouter, hFragment } from 'mini-framework'

// Define routes
const router = new HashRouter([
  { path: "/", action: () => emit("set-filter", "all") },
  { path: "/active", action: () => emit("set-filter", "active") },
  { path: "/completed", action: () => emit("set-filter", "completed") }
]);

// Initialize router
router.init()

// Example TodoMVC implementation with routing
const state = {
  todos: [],
  filter: "all"
};

const reducers = {
  "set-filter": (state, filter) => ({
    ...state,
    filter
  })
};

function App(state, emit) {
  return hFragment([
    h("ul", { class: "filters" }, [
      h("li", {}, [
        h("a", { 
          href: "#/", 
          class: state.filter === "all" ? "selected" : "",
          on: { click: () => emit("set-filter", "all") }
        }, ["All"])
      ]),
      h("li", {}, [
        h("a", { 
          href: "#/active", 
          class: state.filter === "active" ? "selected" : "",
          on: { click: () => emit("set-filter", "active") }
        }, ["Active"])
      ]),
      h("li", {}, [
        h("a", { 
          href: "#/completed", 
          class: state.filter === "completed" ? "selected" : "",
          on: { click: () => emit("set-filter", "completed") }
        }, ["Completed"])
      ])
    ])
  ]);
}
```

#### Router Features

- **Hash-based routing**: Uses URL hashes for navigation (#/path)
- **Route actions**: Execute functions when routes match
- **Navigation methods**: 
  - `router.navigateTo(path)`: Navigate programmatically
  - `router.back()`: Go to previous route
  - `router.forward()`: Go to next route
- **Route subscription**: Listen for route changes
- **Route parameters**: Extract parameters from URLs

#### Router API

```javascript
// Create router instance
const router = new HashRouter([
  { 
    path: "/", 
    action: () => console.log("Home route") 
  },
  { 
    path: "/users/:id", 
    action: () => console.log("User route") 
  }
]);

// Initialize router
await router.init();

// Subscribe to route changes
router.subscribe(() => {
  console.log("Route changed:", router.matchedRoute);
  console.log("Route params:", router.params);
});

// Navigation
router.navigateTo("/users/123");
router.back();
router.forward();
```

#### Route Parameters

The router supports URL parameters and query strings:

```javascript
// Route with parameters
const routes = [
  { 
    path: "/users/:id/posts/:postId",
    action: () => {
      const { id, postId } = router.params;
      console.log(`User ${id}, Post ${postId}`);
    }
  }
];

// URL with query parameters: #/search?q=test&page=1
router.navigateTo("/search?q=test&page=1");
console.log(router.query); // { q: "test", page: "1" }
```

#### Best Practices for Routing

1. Initialize router before mounting the app
2. Use route actions to update application state
3. Keep routes simple and descriptive
4. Handle 404 cases with a catch-all route
5. Use router.subscribe() for global route change handling

## API Reference

### Core Functions

- `createApp({ state, reducers, view })`
- `h(tag, props, children)`
- `hString(text)`
- `hFragment(nodes)`

### Lifecycle Methods

The app instance provides two main methods:

- `mount(element)`: Mounts the app to a DOM element
- `unmount()`: Removes the app from the DOM

## Best Practices

1. Keep state immutable
2. Use pure functions for reducers
3. Split complex components into smaller ones
4. Use fragments for multiple root elements
5. Avoid direct DOM manipulation

## Examples

Check the `/examples` directory for more complex examples including:
- Todo List Application

## License

MIT License - See LICENSE file for details
