export function createRouter(app) {
  if (!app || typeof app.emit !== 'function') {
    throw new Error('Router requires an app instance with an emit function');
  }

  const routes = {
    '#/': () => app.emit('set-filter', 'all'),
    '#/active': () => app.emit('set-filter', 'active'),
    '#/completed': () => app.emit('set-filter', 'completed')
  };

  function handleRoute() {
    const hash = window.location.hash || '#/';
    const route = routes[hash];
    if (route) route();
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  return {
    destroy: () => window.removeEventListener('hashchange', handleRoute)
  };
}
