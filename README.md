Pimm
====

Pimm is an easy-going web framework for Node. Pimm focuses on removing boilerplate code from your
applications, letting you tend to the logic and architecture _(the fun bits!)_ of your app.

# Guides

## Controllers

Controllers are where Pimm shines the most. Pimm enables you to group your request handlers
logically into tiny modules, separate from any concept of routing.

```js
var PostsController = function PostsController() {};

// write controller methods as prototype functions!
PostsController.prototype.index = function index() {
  var posts = [];
  return this.json(posts);
};

module.exports = PostsController;
```

## Routes

Routes are configured directly on your Pimm instance. Rather than passing callback functions into
routes, you pass in a string that represents the controller and method that should be invoked.

```js
var Pimm = require('pimm');
var app = Pimm();

app.routes(function() {
  // auto-create CRUD routes
  this.resources('posts');

  // namepace routes!
  this.namespace('api', function() {
    this.resources('posts');
    this.resource('profile');
  });

  // create manual routes
  this.get('login', 'sessions#new');
});
```
