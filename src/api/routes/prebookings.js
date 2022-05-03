const Router = require('@koa/router');
const router = new Router({ prefix: '/prebooking' })

const { auth } = require("../middlewares");

const controllers = require("../../controllers");


router.post("/book", auth.checkAuth, async (ctx) => {

    if (ctx.user.type != "buyer") {
        ctx.status = 401;
        ctx.body = { err: "action not allowed for this account type" };
        return;
    }


    try {
        const { listing_id, quantity } = ctx.request.body;

        const response = await controllers.prebookings.book(ctx.user, listing_id, quantity);

        ctx.status = response.status;
        if (response.body) {
            ctx.body = response.body;
        }
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = err.body;
        return;
    }

});

router.post("/cancel", auth.checkAuth, async (ctx) => {
    if (ctx.user.type != "buyer") {
        ctx.status = 401;
        ctx.body = { err: "action not allowed for this account type" };
        return;
    }


    try {
        const { prebooking_number } = ctx.request.body;

        const response = await controllers.prebookings.cancel(ctx.user, prebooking_number);

        ctx.status = response.status;
        if (response.body) {
            ctx.body = response.body;
        }

    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = err.body;
        return;
    }
});


module.exports = router;