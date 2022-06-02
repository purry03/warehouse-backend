import * as Router from '@koa/router';

import authRouter from './routes/auth';
import listingRouter from './routes/listings';
import prebookRouter from './routes/prebookings';

const apiRouter = new Router({ prefix: '/api' });


apiRouter.use(authRouter.routes());
apiRouter.use(authRouter.allowedMethods());

apiRouter.use(listingRouter.routes());
apiRouter.use(listingRouter.allowedMethods());

apiRouter.use(prebookRouter.routes());
apiRouter.use(prebookRouter.allowedMethods());

export default {apiRouter};
