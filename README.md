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
