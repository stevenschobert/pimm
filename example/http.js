var Pimm = require('../');

/**
 * Create our Pimm app. Set "dir" to the current directory.
 * This will tell Pimm to look in the current directory
 * for a "controllers" and "views" folder.
 */
var app = new Pimm({
  dir: __dirname,
});

/**
 * You can easily pull the routes definition into a separate file
 * if you prefer, but here we define them inline. You can also call
 * this routes method numerous times to add additional routes.
 *
 * Any routes you define that do _not_ resolve to a real controller
 * method actually get ignored. This way you can define a "resource"
 * and only implement the CRUD methods you actually want to fulfill.
 */
app.routes(function() {
  this.resources('posts');
});

/**
 * The application start returns a promise that resolves when all
 * views & controllers have been loaded, and the application has
 * started up.
 */
app.start().then(function() {
  console.log('Application started!');
});
