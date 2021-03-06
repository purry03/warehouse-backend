const Router = require('@koa/router');

const authRouter = require('./routes/auth');
const listingRouter = require('./routes/listings');
const prebookRouter = require('./routes/prebookings');

const apiRouter = new Router({ prefix: '/api' });

const nestedRouters = [authRouter, listingRouter, prebookRouter];

nestedRouters.forEach((router) => apiRouter.use(router.routes(), router.allowedMethods()));

module.exports = apiRouter;
