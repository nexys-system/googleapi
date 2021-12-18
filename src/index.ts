import Koa from 'koa';
import Router from 'koa-router';

import Gmail from './routes/gmail';
import OAuthGoogle from './routes/auth';

const app = new Koa();
const router = new Router();

router.use('/sso/google', OAuthGoogle);
router.use('/gmail', Gmail);

router.get('/', ctx => {
  ctx.body = { message: 'hello' };
});

app.use(router.routes());

const port = 3022;
app.listen(port, () => console.log(`server started on port ${port}`));
