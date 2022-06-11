import {
  Context
} from "koa";

import * as Router from '@koa/router';
const router = new Router({
  prefix: '/listing'
});

import * as multer from '@koa/multer';

import auth from '../middlewares';

import controllers from '../../controllers';

const upload = multer({
  dest: __dirname + '../../../uploads/'
});

router.post('/add', auth.checkAuth, upload.single('img'), async (ctx: Context) => {
  await controllers.listings.create(ctx);
});

router.post('/remove/:id', auth.checkAuth, upload.single('img'), async (ctx: Context) => {
  await controllers.listings.remove(ctx);
});

router.get('/search', async (ctx: Context) => {
  await controllers.listings.getAll(ctx);
});

router.get('/search/:query', async (ctx: Context) => {
  await controllers.listings.search(ctx);
});

router.get('/id/:id', async (ctx: Context) => {
  await controllers.listings.getByID(ctx);
});

router.get('/seller/:username', auth.checkAuth, async (ctx: Context) => {
  await controllers.listings.getByUsername(ctx);
});

export default router;