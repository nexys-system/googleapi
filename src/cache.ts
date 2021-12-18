import Cache from '@nexys/node-cache';

const cache = new Cache({ persistent: true });

const tokenKey = 'token';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export const setToken = (tokens: Tokens) => cache.set(tokenKey, tokens);

export const getTokens = (): Tokens => {
  const s = cache.get<Tokens>(tokenKey);

  if (s === undefined) {
    throw Error('could not fetch token');
  }

  return s;
};

export const getToken = (
  tokenAttribute: keyof Tokens = 'access_token'
): string => {
  const s = getTokens();

  return s[tokenAttribute];
};

export default cache;
