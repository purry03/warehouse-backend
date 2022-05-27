const Router = require('@koa/router');

const router = new Router({ prefix: '/prebooking' });

const { auth } = require('../middlewares');

const controllers = require('../../controllers');

router.post('/book', auth.checkAuth, async (ctx) => {
  if (ctx.user.type !== 'buyer') {
    ctx.status = 401;
    ctx.body = { err: 'action not allowed for this account type' };
    return;
  }

  try {
    const [listingID, quantity] = [ctx.request.body.listing_id, ctx.request.body.quantity];

    const response = await controllers.prebookings.book(ctx.user, listingID, quantity);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/cancel', auth.checkAuth, async (ctx) => {
  try {
    const prebookingNumber = ctx.request.body.prebooking_number;

    const response = await controllers.prebookings.cancel(prebookingNumber);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/approve', auth.checkAuth, async (ctx) => {
  try {
    const prebookingNumber = ctx.request.body.prebooking_number;

    const response = await controllers.prebookings.approve(prebookingNumber);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

router.post('/get', auth.checkAuth, async (ctx) => {
  try {
    const prebookingNumber = ctx.request.body.prebooking_number;

    const response = await controllers.prebookings.get(prebookingNumber);

    ctx.status = response.status;
    if (response.body) {
      ctx.body = response.body;
    }
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
  }
});

module.exports = router;
