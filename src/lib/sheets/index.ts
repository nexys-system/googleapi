//import fetch from '../fetch2';

import { paramsToString } from '../utils';

// https://developers.google.com/sheets/api/reference/rest
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
const host = 'https://sheets.googleapis.com';

interface Params {
  key: string;
  access_token: string;
}

export const get = async (
  spreadsheetId: string,
  params: Params
): Promise<any> => {
  const queryString = paramsToString(params);
  const path = `/v4/spreadsheets/${spreadsheetId}?${queryString}`;

  const r = await fetch(host + path, {
    method: 'GET',
    headers: { 'content-type': 'application/json' }
  });

  return r.json();
};

/**
 *
 * @param spreadsheetId
 * @param range
 * @see https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
 */
export const getValues = async (
  spreadsheetId: string,
  range: string,
  params: Params
): Promise<{ values: string[][] }> => {
  const queryString = paramsToString(params);
  const path = `/v4/spreadsheets/${spreadsheetId}/values/${range}?${queryString}`;

  const r = await fetch(host + path, {
    method: 'GET',
    headers: { 'content-type': 'application/json' }
  });

  return r.json();
};
