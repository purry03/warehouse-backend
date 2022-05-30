import { Context } from "koa";

import * as Router from '@koa/router';

const router = new Router({ prefix: '/auth' });

import auth  from '../middlewares';

import controllers  from '../../controllers';

router.post('/register', async (ctx: Context) => {
  try {
    const { username, password, type } = <ReqRegister>ctx.request.body;
    const response = <Response>(await controllers.users.register(username, password, type));
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    } return;
  } catch (err: any){
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/login', async (ctx: Context) => {
  try {
    const { username, password } = <ReqLogin>ctx.request.body;
    const response = <Response>(await controllers.users.login(username, password));
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
    return;
  } catch (err: any) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/refresh', async (ctx: Context) => {
  try {
    const [username, refreshToken] = [ctx.request.body.username, ctx.request.body.refresh_token];

    // check if refresh token exists in db

    const response = <Response>(await controllers.tokens.refresh(username, refreshToken));
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err: any) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.get('/verify', auth.checkAuth, async (ctx: Context) => {
  ctx.status = 200;
});

export default router.routes();