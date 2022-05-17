const Router = require('@koa/router');
const router = new Router({ prefix: '/listing' })

const { auth } = require("../middlewares");

const controllers = require("../../controllers");

const multer = require('@koa/multer');
const { checkAuth } = require('../middlewares/auth');
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

router.post('/remove/:id', auth.checkAuth, upload.single('img'), async (ctx) => {
    try {
        const { id } = ctx.request.params;
        const response = await controllers.listings.remove(id);
        ctx.status = response.status;
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = { err };
        return;
    }
});

router.get("/search", async (ctx) => {
    try {
        const response = await controllers.listings.getAll();
        ctx.status = response.status;
        if (response.body) {
            ctx.body = response.body
        }
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = { err };
        return;
    }
});


router.get("/search/:query", async (ctx) => {
    try {
        const query = ctx.params.query;
        const response = await controllers.listings.search(query);
        ctx.status = response.status;
        if (response.body) {
            ctx.body = response.body
        }
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = { err };
        return;
    }
});

router.get("/id/:id", async (ctx) => {
    try {
        const id = ctx.params.id;
        const response = await controllers.listings.getByID(id);
        ctx.status = response.status;
        if (response.body) {
            ctx.body = response.body
        }
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = { err };
        return;
    }
});


router.get("/seller/:username", checkAuth, async (ctx) => {
    try {
        const username = ctx.params.username;
        const response = await controllers.listings.getByUsername(username);
        ctx.status = response.status;
        if (response.body) {
            ctx.body = response.body
        }
    }
    catch (err) {
        ctx.status = err.status;
        ctx.body = { err };
        return;
    }
});

module.exports = router;