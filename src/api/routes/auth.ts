import {
  Context
} from "koa";

import * as Router from '@koa/router';

const router = new Router({
  prefix: '/auth'
});

import auth from '../middlewares';

import controllers from '../../controllers';

router.post('/register', async (ctx: Context) => {
  await controllers.users.register(ctx);
});

router.post('/login', async (ctx: Context) => {
  await controllers.users.login(ctx);
});

router.post('/refresh', async (ctx: Context) => {
  await controllers.tokens.refresh(ctx);
});

router.get('/verify', auth.checkAuth, async (ctx: Context) => {
  ctx.status = 200;
});

export default router;