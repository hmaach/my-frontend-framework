# Mini-Framework Documentation

## Overview
Mini-Framework is a lightweight JavaScript framework that provides a robust foundation for building web applications. It features a virtual DOM implementation, event system, routing, and state management.

## Core Features
- Virtual DOM with efficient diffing and patching
- Comprehensive event handling system
- Component-based architecture
- State management with reducers
- Simple routing system

## Core Concepts

### 1. Virtual DOM
The framework uses a virtual DOM to optimize rendering performance. Changes are first made to a virtual representation of the DOM, then efficiently patched to the real DOM.

### 2. Event System
Two event handling approaches are provided:
- Direct event binding using `addEvent` method
- Declarative event handling through component props

### 3. Application Architecture
Applications are built using:
- State: Application data
- Reducers: Functions that modify state
- Views: Functions that render UI based on state

### 4. Component Creation
Components are created using the `h` function:
```javascript
h('div', { class: 'container' }, [
    h('h1', {}, ['Hello World']),
    h('button', { onClick: handler }, ['Click me'])
])
```

For detailed examples and usage, see [Examples](examples.md).
