var Pimm = require('../'),
    app = Pimm({dir: __dirname});

app.routes(function() {
  this.resources('posts');
});

app.start();
