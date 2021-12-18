import fetch from 'node-fetch';
import * as C from '../../config';
import { getToken } from '../../cache';
import { paramsToString } from '../utils';

// https://developers.google.com/sheets/api/reference/rest
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
const host = 'https://sheets.googleapis.com';

const params = {
  key: C.googleSheetsKey,
  access_token: getToken()
};

const queryString = paramsToString(params);

export const get = async (spreadsheetId: string): Promise<any> => {
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
  range: string
): Promise<{ values: string[][] }> => {
  const path = `/v4/spreadsheets/${spreadsheetId}/values/${range}?${queryString}`;

  const r = await fetch(host + path, {
    method: 'GET',
    headers: { 'content-type': 'application/json' }
  });

  return r.json();
};
