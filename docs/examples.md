# Mini-Framework Examples

## Creating Elements

### Basic Elements

```javascript
import { h } from './core/dom.js';

// Create a div
const div = h('div', { class: 'container' }, [
  'Hello World'
]);

// Create a button
const button = h('button', { class: 'btn' }, [
  'Click me'
]);
```

### Adding Attributes

```javascript
// Element with multiple attributes
const input = h('input', {
  type: 'text',
  class: 'form-input',
  placeholder: 'Enter your name',
  value: 'John'
});

// Using data attributes
const card = h('div', {
  class: 'card',
  'data-id': '123',
  'aria-label': 'User card'
});
```

### Event Handling

```javascript
// Button with click handler
const button = h('button', {
  on: {
    click: (e) => {
      console.log('Button clicked!');
    }
  }
}, ['Click Me']);

// Form with multiple events
const form = h('form', {
  on: {
    submit: (e) => e.preventDefault(),
    change: (e) => console.log('Form changed')
  }
});
```

### Nesting Elements

```javascript
// Complex nested structure
const card = h('div', { class: 'card' }, [
  h('div', { class: 'card-header' }, [
    h('h2', {}, ['Title']),
    h('button', { class: 'close-btn' }, ['×'])
  ]),
  h('div', { class: 'card-body' }, [
    h('p', {}, ['Content goes here']),
    h('button', { class: 'btn' }, ['Action'])
  ])
]);
```

## Creating Components

```javascript
import { defineComponent, h } from './core/index.js';

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

## Using the Router

```javascript
import { createApp } from './core/app.js';
import { HashRouter } from './core/router.js';
import { RouterLink, RouterOutlet } from './core/router-components.js';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/users/:id', component: UserProfile }
];

const router = new HashRouter(routes);
const app = createApp(App, {}, { router });
```

## How It Works

1. **Virtual DOM**: When you create elements using `h()`, you're building a virtual DOM tree. This is a lightweight JavaScript representation of what you want the real DOM to look like.

2. **Component Lifecycle**: 
   - Components are created with `defineComponent()`
   - The `mount()` process creates the initial DOM
   - State updates trigger re-renders through the virtual DOM diffing
   - The `unmount()` process cleans up resources

3. **State Management**:
   - Components maintain their own state
   - `updateState()` triggers re-renders
   - Changes are batched for performance using the scheduler

4. **Event System**:
   - Events are delegated through the component hierarchy
   - The `emit()` system allows child-to-parent communication
   - Event handlers are automatically cleaned up on unmount
