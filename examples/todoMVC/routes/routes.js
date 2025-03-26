export const routes = {
  '#/': (app) => app.emit('set-filter', 'all'),
  '#/active': (app) => app.emit('set-filter', 'active'),
  '#/completed': (app) => app.emit('set-filter', 'completed')
};
