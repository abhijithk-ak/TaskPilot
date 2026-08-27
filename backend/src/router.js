const url = require('url');

class Router {
  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {}
    };
  }

  get(path, handler) {
    this.routes.GET[path] = handler;
  }

  post(path, handler) {
    this.routes.POST[path] = handler;
  }

  put(path, handler) {
    this.routes.PUT[path] = handler;
  }

  delete(path, handler) {
    this.routes.DELETE[path] = handler;
  }

  matchRoute(method, pathname) {
    const route = this.routes[method][pathname];
    if (route) return { handler: route, params: {} };

    // Handle dynamic routes (e.g., /tasks/:id)
    for (const pattern in this.routes[method]) {
      const paramNames = [];
      const regexPattern = pattern
        .split('/')
        .map(segment => {
          if (segment.startsWith(':')) {
            paramNames.push(segment.slice(1));
            return '([^\\/]+)';
          }
          return segment;
        })
        .join('\\/');

      const regex = new RegExp(`^${regexPattern}$`);
      const match = pathname.match(regex);

      if (match) {
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { handler: this.routes[method][pattern], params };
      }
    }

    return null;
  }

  async handle(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    const match = this.matchRoute(method, pathname);

    if (match) {
      req.params = match.params;
      req.query = parsedUrl.query;
      await match.handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Route not found' }));
    }
  }
}

module.exports = Router;
