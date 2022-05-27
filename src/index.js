const path = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const api = require('./api');

const app = new Koa();

app.use(serve(path.join(__dirname, '../../public')));

app.use(koaBody());
app.use(cors());

app.use(api.routes());
app.use(api.allowedMethods());

app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server online on port 3000');
  }
});
