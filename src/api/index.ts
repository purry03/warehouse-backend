const Router = require('@koa/router');

const authRouter = require('./routes/auth');
const listingRouter = require('./routes/listings');
const prebookRouter = require('./routes/prebookings');

const apiRouter = new Router({ prefix: '/api' });


apiRouter.use(authRouter);
apiRouter.use(listingRouter);
apiRouter.use(prebookRouter);

export {apiRouter};
