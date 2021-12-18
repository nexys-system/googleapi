import Router from 'koa-router';

import * as OAuth from '../oauth';

import { setToken } from '../cache';

// routes
const router = new Router();

router.get('/url', ctx => {
  ctx.body = OAuth.url;
});

router.get('/', ctx => {
  ctx.redirect(OAuth.url);
});

router.get('/redirect', async ctx => {
  const { code } = ctx.query;

  if (typeof code !== 'string') {
    throw Error("code can't be read");
  }
  const { access_token, refresh_token = 'undefined' } =
    await OAuth.ghOauth.callbackComplete(code);

  const profile = await OAuth.ghOauth.getProfile(access_token);

  setToken({ access_token, refresh_token });

  ctx.body = { access_token, refresh_token, profile };
});

export default router.routes();
