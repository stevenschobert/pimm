Pimm
====

Pimm is an easy-going web framework for Node. Pimm focuses on removing boilerplate code from your
applications, letting you tend to the logic and architecture _(the fun bits!)_ of your app.

Highlights:

- Group together request handlers into "controller" modules.
- Run filters before controller methods.
- Render JSON, text, html, and view templates from controllers.
- Easily map routes to controller methods.
- Auto-create CRUD routes in a RESTful pattern.
- Supports 25 different templating engines.
- Deep support for promises.

## Example

If you're the kind of person who likes jump right into the code, check out the full example:

__[Example Pimm Application >](https://github.com/stevenschobert/pimm/tree/master/example)__


API
===

## Pimm

### new Pimm(options)

Creates a new Pimm instance. Accepts an optional configuration object.

```js
var app = new Pimm({
  dir: __dirname
});

// you can also set options after instantiation
app.dir = '/updated/path';
```

**Options**

- **dir** `string` Folder path to load the application from. Default `./`.
- **port** `int` The port to listen on for requests. Default `3000`.
- **caching** `bool` Enables/disables view caching. _Highly recommended_ to enable in
  production. Default `true`.
- **templating** `string` The templating language to use for views. See
  [consolidate.js](https://github.com/visionmedia/consolidate.js/) for a list of supported engines.
  Default `jade`.
- **static** `string` Folder path to serve static assets from. Disabled by default.
- **session** `string` A secret key to use for encoding sesssion cookies. Disabled by default.

### .start()

Starts the application. Returns a promise that resolves when the application has started.

```js
app.start().then(function() {
  console.log('Application started!');
});
```

### .config(name, value?)

Gets/sets an application config value. You can use this as a generic key/value store for shared
configuration across your Pimm app.

```js
app.config('logger', console.log);  // sets a value
app.config('logger')('my message'); // get a value
```

### .use(middleware, args?...)

Add a middleware layer to the app. Additional arguments are passed to the `middleware` function.

```js
app.use(middleware);
```

Pimm uses [mach](https://github.com/mjackson/mach) under the hood for handling middleware. Take a
look at their [wiki](https://github.com/mjackson/mach/wiki/Middleware) for examples.

### .routes(function)

Runs `function` to add routes to the application.

```js
app.routes(function() {
  this.resources('posts'); // plural CRUD routes
  this.resource('profile'); // singular CRUD routes
  this.get('login', 'session#new'); // manual routes
});
```

## Controller

Every controller module you place in the `controllers/` directory will automatically inherit several
APIs for you to use when parsing and responding to requests.

You will mainly interface with these APIs through the `this` context inside your request handlers.

### .json(object, status, headers)

Create a JSON response object. Automatically sets a `Content-Type: "application/json"` header.
Optionally accepts a `status` and `headers` object.

```js
PostsController.prototype.index = function index(request) {
  return this.json({test: 'value!'});
};
```

### .text(string, status, headers)

Create a text response object. Automatically sets a `Content-Type: "text/plain"` header.
Optionally accepts a `status` and `headers` object.

```js
PostsController.prototype.index = function index(request) {
  return this.text('Not found!', 404);
};
```

### .html(string, status, headers)

Create a html response object. Automatically sets a `Content-Type: "text/html"` header.
Optionally accepts a `status` and `headers` object.

```js
PostsController.prototype.index = function index(request) {
  return this.html('<h1>Hello world!</h1>');
};
```

### .send(string, status, headers)

Create a manual response object. Useful if none of the other response helper methods fit your needs.

```js
PostsController.prototype.index = function index(request) {
  return this.send('<p>Not Found!</p>', 404, {'Content-Type': 'text/html'});
};
```

### .redirect(location, status, headers)

Creates a redirect response object. Automatically sets the status to `302` and a `Location` header.

```js
PostsController.prototype.index = function index(request) {
  return this.redirect('/some-new-url');
};
```

### .render(view, data, status, headers)

Creates a response object by rendering a view file. Rather than passing a template to the render
method, you pass a string that represents the file path (relative to the views directory) of the
view to render.

```js
PostsController.prototype.index = function index(request) {
  return this.render('posts/index', {posts: [...]});
};
```

### .before(method..., function)

Wraps a request method(s) with a new function. If the wrapper function returns a value, the
underlying method will never get invoked.

```js
PostsController = function PostsController() {
  this.before('index', 'create', function(request) {
    if (!request.headers['X-Auth-Token']) {
      return this.text('Not authed!', 401);
    }
  });
};

PostsController.prototype.index = function index(request) {
  return this.text('Authed!');
};
```
