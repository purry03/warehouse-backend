import {
  Context
} from "koa";

import * as Router from '@koa/router';

const router = new Router({
  prefix: '/prebooking'
});

import auth from '../middlewares';

import controllers from '../../controllers';

router.post('/book', auth.checkAuth, async (ctx: Context) => {
  await controllers.prebookings.book(ctx);
});

router.post('/cancel', auth.checkAuth, async (ctx: Context) => {
  await controllers.prebookings.cancel(ctx);
});

router.post('/approve', auth.checkAuth, async (ctx: Context) => {
  await controllers.prebookings.approve(ctx);
});

router.post('/get', auth.checkAuth, async (ctx: Context) => {
  await controllers.prebookings.get(ctx);
});

export default router;