const path = require("path");

global.__basedir = path.resolve("../", __dirname);

const Koa = require('koa');
const koaBody = require('koa-body');
const api = require("./api");
const app = new Koa();

app.use(koaBody());

app.use(api.routes());
app.use(api.allowedMethods());

app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Server online on port 3000");
    }
});

