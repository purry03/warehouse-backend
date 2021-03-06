const Router = require('@koa/router');

const router = new Router({ prefix: '/auth' });

const { auth } = require('../middlewares');

const controllers = require('../../controllers');

router.post('/register', async (ctx) => {
  try {
    const { username, password, type } = ctx.request.body;
    const response = await controllers.users.register(username, password, type);
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    } return;
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body;
    const response = await controllers.users.login(username, password);
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
    return;
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/refresh', async (ctx) => {
  try {
    const [username, refreshToken] = [ctx.request.body.username, ctx.request.body.refresh_token];

    // check if refresh token exists in db

    const response = await controllers.tokens.refresh(username, refreshToken);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.get('/verify', auth.checkAuth, async (ctx) => {
  ctx.status = 200;
});

module.exports = router;
