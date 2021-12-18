export const decode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
export const encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

/**
 * decode base64 text in UTF8
 * @param encoded string
 * @return decoded string
 */
export const b64DecodeUnicode = (str: string): string => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
};

export const paramsToString = (a: { [k: string]: any }): string =>
  Object.entries(a)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
