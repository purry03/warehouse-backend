import { Context } from "koa";

import * as Router from '@koa/router';

const router = new Router({ prefix: '/prebooking' });

import auth from '../middlewares';

import controllers  from '../../controllers';

router.post('/book', auth.checkAuth, async (ctx: Context) => {
  if (ctx.user.type !== 'buyer') {
    ctx.status = 401;
    ctx.body = { err: 'action not allowed for this account type' };
    return;
  }

  try {
    const [listingID, quantity] = [ctx.request.body.listing_id, ctx.request.body.quantity];

    const response = <Response>(await controllers.prebookings.book(ctx.user, listingID, quantity));

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err:any) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/cancel', auth.checkAuth, async (ctx: Context) => {
  try {
    const prebookingNumber:string = ctx.request.body.prebooking_number;

    const response = <Response>(await controllers.prebookings.cancel(prebookingNumber));

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err:any) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/approve', auth.checkAuth, async (ctx:Context) => {
  try {
    const prebookingNumber:string = ctx.request.body.prebooking_number;
``
    const response = await controllers.prebookings.approve(prebookingNumber);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err:any) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/get', auth.checkAuth, async (ctx: Context) => {
  try {
    const prebookingNumber:string = ctx.request.body.prebooking_number;

    const response = await controllers.prebookings.get(prebookingNumber);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err:any) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

export default router.routes();