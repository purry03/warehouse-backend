const Router = require('@koa/router');
const router = new Router({ prefix: '/listing' })

const { auth } = require("../middlewares");

const controllers = require("../../controllers");

const multer = require('@koa/multer');
const upload = multer({ dest: '../uploads/' });

router.post('/add', auth.checkAuth, upload.single('img'), async (ctx) => {
    try {
        const { title, description, price, inventory } = ctx.request.body;
        const response = await controllers.listings.create(ctx.user, ctx.file, title, description, price, inventory);
        ctx.status = response.status;
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = { err };
        return;
    }
});

module.exports = router;