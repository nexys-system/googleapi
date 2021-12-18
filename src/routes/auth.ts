import Router from 'koa-router';

import * as oauth from '@nexys/oauth';
import * as C from '../config';

const ghOauth = new oauth.Google(
  C.googleSSO.client,
  C.googleSSO.secret,
  C.googleSSO.redirect_uri
);
const scopes = ['userinfo.profile', 'userinfo.email', 'gmail.readonly'].map(
  x => `https://www.googleapis.com/auth/${x}`
);
const state = undefined;
const oauthUrl = ghOauth.oAuthUrl(state, scopes);

// routes
const router = new Router();

router.get('/url', ctx => {
  ctx.body = oauthUrl;
});

router.get('/', ctx => {
  ctx.redirect(oauthUrl);
});

router.get('/redirect', async ctx => {
  const { code } = ctx.query;

  if (typeof code !== 'string') {
    throw Error("code can't be read");
  }
  const token = await ghOauth.callback(code);
  const profile = await ghOauth.getProfile(token);

  ctx.body = { token, profile };
});

export default router.routes();
