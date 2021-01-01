import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import jwt from 'next-auth/jwt';
import { TokenService } from '../../../services/TokenService';

const providers = [
  Providers.IdentityServer4({
    id: process.env.IDENTITYSERVER_ID,
    name: process.env.IDENTITYSERVER_NAME,
    scope: process.env.IDENTITYSERVER_SCOPE,
    domain: process.env.IDENTITYSERVER_DOMAIN,
    clientId: process.env.IDENTITYSERVER_CLIENT_ID,
    clientSecret: process.env.IDENTITYSERVER_SECRET,
  }),
];

const callbacks = {};

callbacks.signIn = async function signIn(user, account, profile) {
  if (account.provider === 'identity-server') {
    user.nationalId = profile.nationalId;
    user.accessToken = account.accessToken;
    user.refreshToken = account.refreshToken;
    return true;
  }

  return false;
};

callbacks.jwt = async function jwt(token, user) {
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
  }

  const decoded = parseJwt(token.accessToken);

  if (decoded?.exp && new Date() > new Date(decoded.exp * 1000)) {
    try {
      [
        token.accessToken,
        token.refreshToken,
      ] = await TokenService.refreshAccessToken(token.refreshToken);
    } catch (error) {
      console.error(error, 'Error refreshing access token.');
    }
  }

  return token;
};

callbacks.session = async function session(session, token) {
  session.accessToken = token.accessToken;
  session.refreshToken = token.refreshToken;
  const decoded = parseJwt(session.accessToken);
  session.expires = new Date(decoded.exp * 1000);
  return session;
};

function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  let decodedData = JSON.parse(
    Buffer.from(base64, 'base64').toString('binary')
  );

  return decodedData;
}

const options = { providers, callbacks };

export default (req, res) => NextAuth(req, res, options);
