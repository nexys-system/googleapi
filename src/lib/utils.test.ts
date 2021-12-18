import * as U from './utils';

const b64 = 'SGVsbG8sIFdvcmxkIQ==';
const str = 'Hello, World!';

test('base64 decode', () => {
  expect(U.decode(b64)).toEqual(str);
});

test('base64 decode', () => {
  expect(U.encode(str)).toEqual(b64);
});

test('base64 encode/decode', () => {
  expect(U.decode(U.encode(str))).toEqual(str);
});

/*
test('b64DecodeUnicode', () => {
  expect(U.b64DecodeUnicode(b64)).toEqual(str);
})*/
