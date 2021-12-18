import * as G from './googlemail';
import * as T from './type';

test('filterToQuery', () => {
  const filter: T.GoogleEmailFilter = { after: '2020-09-01', from: 'mysender' };
  const s = 'from:mysender after:2020-09-01';
  expect(G.filterToQuery(filter)).toEqual(s);
});
