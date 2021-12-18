import * as oauth from '@nexys/oauth';
import * as C from './config';
import { setToken, Tokens } from './cache';

export const ghOauth = new oauth.Google(
  C.googleSSO.client,
  C.googleSSO.secret,
  C.googleSSO.redirect_uri
);

// scopes for google sheets: https://developers.google.com/sheets/api/guides/authorizing
const scopes = ['userinfo.profile', 'userinfo.email', 'gmail.readonly'].map(
  x => `https://www.googleapis.com/auth/${x}`
);
const state = undefined;

export const url = ghOauth.oAuthUrl(state, scopes);

export const getRefreshedToken = async (
  refresh_token: string
): Promise<Tokens> => {
  const access_token = await ghOauth.getRefreshedToken(refresh_token);
  const rTokens = { access_token, refresh_token };
  setToken(rTokens);

  return rTokens;
};
