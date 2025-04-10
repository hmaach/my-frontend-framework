# MiniDOM Framework Documentation

MiniDOM is a lightweight JavaScript framework for building user interfaces with a virtual DOM approach. This documentation will help you understand how to use the framework's features and components.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Creating Elements](#creating-elements)
- [Component System](#component-system)
- [Event Handling](#event-handling)
- [Routing](#routing)
- [Lifecycle Methods](#lifecycle-methods)
- [Advanced Features](#advanced-features)

## Features

MiniDOM provides the following core features:

- **Virtual DOM**: Efficient DOM updates through diffing and patching
- **Component-based Architecture**: Create reusable, encapsulated UI components
- **Event Handling**: Simple API for adding and managing event listeners
- **Routing**: Built-in hash-based router for single-page applications
- **Lifecycle Methods**: Control component behavior through lifecycle hooks
- **Attributes Management**: Easy API for handling element attributes, classes, and styles

## Getting Started

To create and mount an application, use the `createApp` function:

```javascript
import { createApp, defineComponent, h } from 'minidom';

// Create a root component
const App = defineComponent({
  render() {
    return h('div', { class: 'app' }, [
      h('h1', {}, ['Hello, MiniDOM!'])
    ]);
  }
});

// Create and mount the application
const app = createApp(App);
app.mount(document.getElementById('root'));
```

## Creating Elements

### Basic Elements

The framework uses the `h` (hyperscript) function to create virtual DOM elements:

```javascript
import { h } from 'minidom';

// Creating a div with a class
const div = h('div', { class: 'container' }, []);

// Creating a paragraph with text
const paragraph = h('p', {}, ['This is a paragraph']);

// Creating a link with attributes
const link = h('a', { href: 'https://example.com', target: '_blank' }, ['Visit Example']);
```

### Nesting Elements

You can nest elements by adding them to the children array:

```javascript
const card = h('div', { class: 'card' }, [
  h('div', { class: 'card-header' }, [
    h('h2', {}, ['Card Title'])
  ]),
  h('div', { class: 'card-body' }, [
    h('p', {}, ['Card content goes here']),
    h('button', { class: 'btn' }, ['Click Me'])
  ])
]);
```

### Text Nodes

For simple text nodes, you can include strings in the children array:

```javascript
const heading = h('h1', {}, [hString('Hello, World!')]);
```

### Fragments

For grouping elements without adding an extra DOM node, use the `hFragment` function:

```javascript
import { hFragment, h } from 'minidom';

const fragment = hFragment([
  h('h1', {}, ['Title']),
  h('p', {}, ['Paragraph']),
  h('button', {}, ['Button'])
]);
```

## Component System

### Defining Components

Use the `defineComponent` function to create reusable components:

```javascript
import { defineComponent, h } from 'minidom';

const Button = defineComponent({
  render() {
    return h('button', { class: 'btn' }, [this.props.label || 'Button']);
  }
});

// Using the component
const buttonElement = h(Button, { label: 'Click Me' }, []);
```

### Component with State

Components can have internal state:

```javascript
const Counter = defineComponent({
  // Initialize state based on props
  state(props) {
    return {
      count: props.initialCount || 0
    };
  },
  
  // Render method
  render() {
    return h('div', {}, [
      h('p', {}, [`Count: ${this.state.count}`]),
      h('button', { 
        on: {
          click: this.increment
        }
      }, ['Increment'])
    ]);
  },
  
  // Custom methods
  increment() {
    this.updateState({
      count: this.state.count + 1
    });
  }
});

// Using the component with initial props
const counterElement = h(Counter, { initialCount: 5 }, []);
```

## Event Handling

### Adding Event Listeners

Add event listeners using the `on` property in the props object:

```javascript
const button = h('button', { 
  on: {
    click: () => console.log('Button clicked!'),
    mouseover: () => console.log('Mouse over'),
    mouseout: () => console.log('Mouse out')
  }
}, ['Click Me']);
```

### Event Handling in Components

In components, you can define methods to handle events:

```javascript
const Form = defineComponent({
  state() {
    return { 
      name: '',
      email: ''
    };
  },
  
  render() {
    return h('form', { 
      on: { 
        submit: this.handleSubmit 
      }
    }, [
      h('input', { 
        type: 'text',
        value: this.state.name,
        on: {
          input: this.handleNameChange
        }
      }, []),
      h('input', { 
        type: 'email',
        value: this.state.email,
        on: {
          input: this.handleEmailChange
        }
      }, []),
      h('button', { type: 'submit' }, ['Submit'])
    ]);
  },
  
  handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted', this.state);
  },
  
  handleNameChange(event) {
    this.updateState({ name: event.target.value });
  },
  
  handleEmailChange(event) {
    this.updateState({ email: event.target.value });
  }
});
```

## Adding Attributes

### Basic Attributes

Add HTML attributes directly in the props object:

```javascript
const image = h('img', { 
  src: 'image.jpg',
  alt: 'Description',
  width: 300,
  height: 200,
  'data-custom': 'value' // Custom data attributes
}, []);
```

### CSS Classes

You can set CSS classes in several ways:

```javascript
// As a string
const div1 = h('div', { class: 'container primary' }, []);

// As an array
const div2 = h('div', { class: ['container', 'primary'] }, []);
```

### Inline Styles

Set inline styles using the style object:

```javascript
const styledDiv = h('div', { 
  style: {
    color: 'red',
    backgroundColor: 'black',
    fontSize: '16px',
    padding: '10px'
  }
}, ['Styled Text']);
```

## Routing

The framework includes a hash-based router for building single-page applications:

```javascript
import { createApp, defineComponent, h, HashRouter } from 'minidom';

const Home = defineComponent({
  render() {
    return h('div', {}, ['Home Page']);
  }
});

const About = defineComponent({
  render() {
    return h('div', {}, ['About Page']);
  }
});

const App = defineComponent({
  render() {
    const { matchedRoute } = this.appContext.router;
    
    let content;
    if (matchedRoute?.path === '/') {
      content = h(Home, {}, []);
    } else if (matchedRoute?.path === '/about') {
      content = h(About, {}, []);
    } else {
      content = h('div', {}, ['Page not found']);
    }
    
    return h('div', {}, [
      // Navigation
      h('nav', {}, [
        h('button', { 
          on: { click: () => this.appContext.router.navigateTo('/') }
        }, ['Home']),
        h('button', { 
          on: { click: () => this.appContext.router.navigateTo('/about') }
        }, ['About'])
      ]),
      // Content
      content
    ]);
  }
});

// Create router with routes
const router = new HashRouter([
  { path: '/' },
  { path: '/about' },
  { path: '*', redirect: '/' } // Catch-all route
]);

// Create app with router
const app = createApp(App, {}, { router });
app.mount(document.getElementById('root'));
```

## Lifecycle Methods

Components have two lifecycle hooks:

```javascript
const Timer = defineComponent({
  state() {
    return { seconds: 0 };
  },
  
  render() {
    return h('div', {}, [
      h('p', {}, [`Seconds: ${this.state.seconds}`])
    ]);
  },
  
  // Called after the component is mounted to the DOM
  onMounted() {
    this.interval = setInterval(() => {
      this.updateState({ seconds: this.state.seconds + 1 });
    }, 1000);
  },
  
  // Called before the component is removed from the DOM
  onUnmounted() {
    clearInterval(this.interval);
  }
});
```

## Component Communication

### Parent to Child: Props

Pass data from parent to child through props:

```javascript
const Parent = defineComponent({
  render() {
    return h('div', {}, [
      h(Child, { message: 'Hello from parent' }, [])
    ]);
  }
});

const Child = defineComponent({
  render() {
    return h('div', {}, [
      h('p', {}, [this.props.message])
    ]);
  }
});
```

### Child to Parent: Events

Children can communicate with parents through custom events:

```javascript
const Parent = defineComponent({
  render() {
    return h('div', {}, [
      h(Child, { 
        on: {
          itemSelected: this.handleItemSelected
        }
      }, [])
    ]);
  },
  
  handleItemSelected(item) {
    console.log('Selected item:', item);
  }
});

const Child = defineComponent({
  render() {
    return h('button', { 
      on: { click: this.selectItem }
    }, ['Select Item']);
  },
  
  selectItem() {
    // Emit a custom event to the parent
    this.emit('itemSelected', { id: 1, name: 'Item 1' });
  }
});
```

## Advanced Features

### Fragments

Use fragments to return multiple elements without a wrapper:

```javascript
const TableRows = defineComponent({
  render() {
    return hFragment([
      h('tr', {}, [
        h('td', {}, ['Row 1, Cell 1']),
        h('td', {}, ['Row 1, Cell 2'])
      ]),
      h('tr', {}, [
        h('td', {}, ['Row 2, Cell 1']),
        h('td', {}, ['Row 2, Cell 2'])
      ])
    ]);
  }
});
```

### Nested Components

Components can be nested within other components:

```javascript
const App = defineComponent({
  render() {
    return h('div', { class: 'app' }, [
      h(Header, {}, []),
      h(Content, { articles: this.props.articles || [] }, []),
      h(Footer, {}, [])
    ]);
  }
});

const Header = defineComponent({
  render() {
    return h('header', {}, [
      h('h1', {}, ['My App']),
      h(Navigation, {}, [])
    ]);
  }
});

const Navigation = defineComponent({
  render() {
    return h('nav', {}, [
      h('a', { href: '#/' }, ['Home']),
      h('a', { href: '#/about' }, ['About']),
      h('a', { href: '#/contact' }, ['Contact'])
    ]);
  }
});

// Article component to be used inside Content
const Article = defineComponent({
  render() {
    const { title, summary, author } = this.props;
    
    return h('article', { class: 'article' }, [
      h('h2', {}, [title]),
      h('p', { class: 'summary' }, [summary]),
      h('div', { class: 'author' }, [
        h('span', {}, [`Written by: ${author}`])
      ]),
      h('button', { 
        class: 'read-more',
        on: { click: () => this.emit('articleSelected', this.props) }
      }, ['Read More'])
    ]);
  }
});

// Content component with nested Article components
const Content = defineComponent({
  render() {
    const { articles } = this.props;
    
    return h('main', { class: 'content' }, [
      h('section', { class: 'welcome' }, [
        h('h2', {}, ['Welcome to Our Site']),
        h('p', {}, ['This is a demonstration of nested components in our framework.'])
      ]),
      h('section', { class: 'articles' }, [
        h('h2', {}, ['Recent Articles']),
        ...articles.map(article => 
          h(Article, {
            ...article,
            on: {
              articleSelected: this.handleArticleSelected
            }
          }, [])
        )
      ])
    ]);
  },
  
  handleArticleSelected(article) {
    console.log('Article selected:', article);
    // You could navigate to the article or perform other actions
    this.appContext.router.navigateTo(`/article/${article.id}`);
  }
});

// A simple form component for the newsletter
const NewsletterForm = defineComponent({
  state() {
    return {
      email: '',
      submitted: false
    };
  },
  
  render() {
    if (this.state.submitted) {
      return h('div', { class: 'thank-you' }, [
        h('p', {}, ['Thanks for subscribing!'])
      ]);
    }
    
    return h('form', { 
      class: 'newsletter-form',
      on: { submit: this.handleSubmit }
    }, [
      h('label', { for: 'email' }, ['Subscribe to our newsletter:']),
      h('div', { class: 'form-row' }, [
        h('input', { 
          type: 'email', 
          id: 'email',
          placeholder: 'Your email address',
          value: this.state.email,
          on: { input: this.handleEmailChange }
        }, []),
        h('button', { type: 'submit' }, ['Subscribe'])
      ])
    ]);
  },
  
  handleEmailChange(event) {
    this.updateState({ email: event.target.value });
  },
  
  handleSubmit(event) {
    event.preventDefault();
    // In a real app, you'd send this to a server
    console.log('Subscribing email:', this.state.email);
    this.updateState({ submitted: true });
  }
});

// Footer component with nested NewsletterForm
const Footer = defineComponent({
  render() {
    return h('footer', { class: 'site-footer' }, [
      h('div', { class: 'footer-columns' }, [
        h('div', { class: 'footer-column' }, [
          h('h3', {}, ['About Us']),
          h('p', {}, ['We are a company dedicated to creating amazing web experiences.'])
        ]),
        h('div', { class: 'footer-column' }, [
          h('h3', {}, ['Quick Links']),
          h('ul', {}, [
            h('li', {}, [h('a', { href: '#/' }, ['Home'])]),
            h('li', {}, [h('a', { href: '#/about' }, ['About'])]),
            h('li', {}, [h('a', { href: '#/contact' }, ['Contact'])]),
            h('li', {}, [h('a', { href: '#/terms' }, ['Terms of Service'])])
          ])
        ]),
        h('div', { class: 'footer-column' }, [
          h('h3', {}, ['Newsletter']),
          h(NewsletterForm, {}, [])
        ])
      ]),
      h('div', { class: 'copyright' }, [
        h('p', {}, ['© 2025 My App. All rights reserved.'])
      ])
    ]);
  }
});

// Sample usage with some data
const articles = [
  { id: 1, title: 'Getting Started with MiniDOM', summary: 'Learn the basics of our framework', author: 'Jane Developer' },
  { id: 2, title: 'Advanced Component Patterns', summary: 'Take your component skills to the next level', author: 'John Coder' },
  { id: 3, title: 'Virtual DOM Explained', summary: 'Understanding the magic behind efficient updates', author: 'Alice Engineer' }
];

// Create and mount the application
const app = createApp(App, { articles });
app.mount(document.getElementById('root'));
```

### Scheduler and Batched Updates

The framework uses a scheduler to batch multiple state updates for efficiency:

```javascript
import { nextTick } from 'minidom';

const Form = defineComponent({
  // ...
  
  async submitForm() {
    // Update multiple state properties
    this.updateState({ isSubmitting: true });
    this.updateState({ errors: {} });
    
    // Wait for DOM to update
    await nextTick();
    
    // Continue with form submission
    try {
      // API call...
      this.updateState({ isSubmitting: false, success: true });
    } catch (error) {
      this.updateState({ isSubmitting: false, errors: error.data });
    }
  }
});
```

## Why Things Work This Way

### Virtual DOM

The framework uses a virtual DOM approach because:

1. **Efficiency**: It minimizes costly DOM operations by only updating what has changed.
2. **Declarative API**: Developers can describe how the UI should look, and the framework handles the DOM manipulations.
3. **Consistency**: The virtual DOM provides a consistent programming model regardless of browser differences.

### Component System

The component-based architecture:

1. **Reusability**: Components can be reused throughout an application.
2. **Encapsulation**: Components encapsulate their markup, styles, and logic.
3. **Maintainability**: Small, focused components are easier to understand and maintain.

### Unidirectional Data Flow

The framework uses a unidirectional data flow:

1. **Predictability**: State changes flow in one direction, making it easier to track and debug.
2. **Simplicity**: The model is simpler to understand than bidirectional data binding.
3. **Performance**: Updates can be optimized when the framework knows exactly what changed.

### Event Handling

Events are handled using a declarative approach:

1. **Simplicity**: Events are bound declaratively using the `on` property in virtual nodes.
2. **Cleanup**: Event handlers are automatically cleaned up when components are unmounted.

## Conclusion

MiniDOM provides a powerful yet lightweight approach to building web interfaces. By understanding the core concepts of components, virtual DOM, and state management, you can build complex applications with maintainable code.