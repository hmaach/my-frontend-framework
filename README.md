# Custom JavaScript Framework

A lightweight JavaScript framework for building web applications with **DOM abstraction, routing, state management, and event handling**.

## 🚀 Features
- **Virtual DOM**: Create and manipulate UI elements efficiently.
- **Routing System**: Synchronize app state with the URL.
- **State Management**: Manage and update application state globally.
- **Custom Event Handling**: Handle user interactions without `addEventListener`.

## 📂 Project Structure
```
custom-js-framework/
│── examples/       # TodoMVC example using the framework
│── packages/
│   ├── compiler/   # Handles transforming custom framework code into JavaScript
│   ├── loader/     # Loads framework-specific components dynamically
│   ├── runtime/    # Provides the runtime behavior for the framework in the browser
│── docs/           # Documentation
│── package.json
│── README.md
```