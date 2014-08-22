Pimm
====

Pimm is an easy-going web framework for Node. Pimm focuses on removing boilerplate code from your
applications, letting you tend to the logic and architecture _(the fun bits!)_ of your app.

# Guides

## Controllers

Controllers are where Pimm shines the most. Pimm enables you to group your request handlers
logically into tiny modules, separate from any concept of routing.

```js
var util = require('util');
var Controller = require('pimm').Controller;

var PostsController = function PostsController() {};

PostsController.prototype.index = function index() {
  var posts = [];
  return this.json(posts);
};

PostsController.prototype.show = function show(request) {
  var id = request.params.id;
  var post = {};
  return this.json(post);
};

util.inherits(PostsController, Controller);
module.exports = PostsController;
```

## Routes

Routes are configured directly on your Pimm instance. Rather than passing callback functions into
routes, you pass in a string that represents the controller and method that should be invoked.

```js
var Pimm = require('pimm');
var app = Pimm();

app.routes(function() {
  // RESTful routes for /posts
  this.resources('posts');

  // API routes
  this.namespace('api', function() {
    this.resources('posts');
    this.resource('profile');
  });

  // manual routes
  this.get('login', 'sessions#new');
});
```

### Resources

Pimm gives you an easy API for defining RESTful _resources_.

```js
// mutiple resources
this.resources('posts');

// a single resource
this.resource('profile');
```

### Manual Routes

Instead of defining _resources_, you can also define routes manually. This can be useful if you
want to use a route differently named from the controller.

```js
this.get('login', 'sessions#new');
this.get('logout', 'sessions#destroy');
```

### Namespacing

You can also scope routes to a _namespace_. This can be really handy for making your API routes
easily recognizable.

```js
this.namespace('api', function() {
  this.resources('posts');
});
```
