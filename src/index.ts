import Koa from 'koa';
import Router from 'koa-router';

import Gmail from './routes/gmail';
import OAuthGoogle from './routes/auth';

const app = new Koa();
const router = new Router();

router.use('/sso/google', OAuthGoogle);
router.use('/gmail', Gmail);

app.use(router.routes());

app.listen(3022);
