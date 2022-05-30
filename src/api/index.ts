import * as Router from '@koa/router';

import authRouter from './routes/auth';
import listingRouter from './routes/listings';
import prebookRouter from './routes/prebookings';

const apiRouter = new Router({ prefix: '/api' });


apiRouter.use(authRouter);
apiRouter.use(listingRouter);
apiRouter.use(prebookRouter);

export default {apiRouter};
