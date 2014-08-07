var Pimm = require('../'),
    repl = require('repl'),
    prompt = repl.start({prompt: '> '}),

    http = new Pimm({dir: __dirname});

prompt.context.Pimm = Pimm;
prompt.context.http = http;
