import dotenv from 'dotenv';

dotenv.config({
  path: '../app/.env',
});

const { env } = process;

export const config = {
  identityServer: {
    clientId: env.IDENTITYSERVER_CLIENT_ID,
    issuer: env.IDENTITYSERVER_ISSUER,
    scopes: env.IDENTITYSERVER_SCOPES?.split(' '),
  },
  apiEndpoint: env.API_ENDPOINT,
  bundleId: env!.BUNDLE_ID_IOS,
  phoneNumber: '010-7789',
};
