import Router from 'koa-router';

import { getTokens } from '../cache';
import * as OAuth from '../oauth';
import * as Googlemail from '../lib/googlemail';

const router = new Router();

router.get('/', async ctx => {
  const l = await Googlemail.listEmailWithIter(
    {},
    15,
    'me',
    getTokens(),
    OAuth.getRefreshedToken
  );
  ctx.body = l.map(x => x.title);
});

export default router.routes();
