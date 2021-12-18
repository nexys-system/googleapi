import NodeCache from 'node-cache';

const cache = new NodeCache();

const tokenKey = 'token';

export const setToken = (token: string) => cache.set(tokenKey, token);
export const getToken = (): string => {
  const s = cache.get<string>(tokenKey);

  if (!s) {
    throw Error('could not fet token');
  }

  return s;
};

export default cache;
