var Pimm = require('../'),
    app = Pimm({
      dir: __dirname,
      static: './public'
    });

app.routes(function() {
  this.resources('posts');
});

app.start();
