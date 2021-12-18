//import dotenv from 'dotenv';

export const googleSSO = {
  client: process.env['GOOGLE_SSO_CLIENT'] || '',
  secret: process.env['GOOGLE_SSO_SECRET'] || '',
  redirect_uri: process.env['GOOGLE_SSO_REDIRECT'] || ''
};
