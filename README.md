# Mini-Framework Documentation

## Overview

Mini-Framework is a lightweight JavaScript framework for building user interfaces. It provides:

- Component-based architecture
- Virtual DOM for efficient updates
- Event handling system
- Router for single-page applications
- State management

## Core Concepts

### Components

Components are the building blocks of your application. Each component can:
- Manage its own state
- Handle lifecycle events (mounted, unmounted)
- Render UI elements
- Emit and handle events

### Virtual DOM

The framework uses a Virtual DOM to optimize rendering performance by:
- Creating a lightweight representation of the DOM
- Efficiently comparing and updating only changed elements
- Batching updates using a scheduler

### Routing

Built-in router supports:
- Hash-based navigation
- Route parameters
- Query string parsing
- Nested routes
- Route redirects

## Getting Started

See the [examples.md](./docs/examples.md) for detailed code examples and usage patterns.