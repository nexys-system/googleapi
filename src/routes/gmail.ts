import Router from 'koa-router';

import { getToken } from '../cache';
import * as Googlemail from '../lib/googlemail';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = await Googlemail.listEmail({}, 15, 'me', getToken());
});

export default router.routes();
