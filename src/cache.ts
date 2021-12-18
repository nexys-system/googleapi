import Cache from './node-cache';

const cache = new Cache({ persistent: true });

const tokenKey = 'token';

interface Tokens {
  access_token: string;
  refresh_token?: string;
}

export const setToken = (tokens: Tokens) => cache.set(tokenKey, tokens);
export const getToken = (): string => {
  const s = cache.get<Tokens>(tokenKey);

  if (!s) {
    throw Error('could not fet token');
  }

  return s.access_token;
};

export default cache;
