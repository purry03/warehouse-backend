import * as path from 'path';

import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as koaBody from 'koa-body';
import * as cors from '@koa/cors';

import api from './api';

const app = new Koa();

app.use(serve(path.join(__dirname, '../public')));

app.use(koaBody());
app.use(cors());

app.use(api.apiRouter.routes());
app.use(api.apiRouter.allowedMethods());

app.listen(8080, () => {
    console.log('Server online on port 3000');
});
