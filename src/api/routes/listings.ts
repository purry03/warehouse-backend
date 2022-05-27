import { Context, Request } from "koa";

const Router = require('@koa/router');
const router = new Router({ prefix: '/listing' });

const multer = require('@koa/multer');
const { auth } = require('../middlewares');

const controllers = require('../../controllers');
const upload = multer({ dest: '../uploads/' });

router.post('/add', auth.checkAuth, upload.single('img'), async (ctx: Context) => {
  try {
    const {
      title, description, price, inventory,
    } = <ReqAddListing>ctx.request.body;

    const response = <Response>(await controllers.listings.create(
      ctx.user,
      ctx.file,
      title,
      description,
      price,
      inventory,
    ));

    ctx.status = response.status;
  } catch (err: any) {
    ctx.status = err.status;
    ctx.body = { err };
  }
});

router.post('/remove/:id', auth.checkAuth, upload.single('img'), async (ctx: Context) => {
  try {
    const { id } = <ID>ctx.params;
    const response = <Response>(await controllers.listings.remove(id));
    ctx.status = response.status;
  } catch (err: any) {
    ctx.status = err.status;
    ctx.body = { err };
  }
});

router.get('/search', async (ctx: Context) => {
  try {
    const response = <Response>(await controllers.listings.getAll());
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err: any) {
    ctx.status = err.status;
    ctx.body = { err };
  }
});

router.get('/search/:query', async (ctx: Context) => {
  try {
    const { query } = <Query>ctx.params;
    const response = <Response>(await controllers.listings.search(query));
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err: any) {
    ctx.status = err.status;
    ctx.body = { err };
  }
});

router.get('/id/:id', async (ctx: Context) => {
  try {
    const { id } = <ID>ctx.params;
    const response = <Response>(await controllers.listings.getByID(id));
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err:any) {
    ctx.status = err.status;
    ctx.body = { err };
  }
});

router.get('/seller/:username', auth.checkAuth, async (ctx: Context) => {
  try {
    const { username } = <Username>ctx.params;
    const response = <Response>(await controllers.listings.getByUsername(username));
    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err:any) {
    ctx.status = err.status;
    ctx.body = { err };
  }
});

export {router};