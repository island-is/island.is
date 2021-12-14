import NextAuth, { CallbacksOptions, Session } from 'next-auth'
import Providers from 'next-auth/providers'
//import IdentityServer4Provider from "next-auth/providers/identity-server4";
import { uuid } from 'uuidv4'
import { identityServerConfig } from '@island.is/air-discount-scheme-web/lib'
import {
  AuthUser,
  signIn as handleSignIn,
  jwt as handleJwt,
  session as handleSession,
  AuthSession,
} from '@island.is/next-ids-auth'
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils'
import { JWT } from 'next-auth/jwt'
import { decode } from 'jsonwebtoken'
import { Router } from 'express'
import idsProvider from './providers'
const providers = [idsProvider]
console.log('random nextauth log')
const callbacks: CallbacksOptions = {
  signIn: signIn,
  jwt: jwt,
  session: session,
}
const pages = {
  signIn: '/auth/signin'
}

async function signIn(
  user: AuthUser,
  account: Record<string, unknown>,
  profile: Record<string, unknown>,
): Promise<boolean> {
  console.log('pre sign in')
  return handleSignIn(user, account, profile, identityServerConfig.id)
}

async function jwt(token: JWT, user: AuthUser) {
  console.log('my token: ' + token)
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
      folder: token.folder ?? uuid(),
      service: 'Loftbru',
    }
  }
  return await handleJwt(
    token,
    identityServerConfig.clientId,
    process.env.IDENTITY_SERVER_SECRET,
    process.env.NEXTAUTH_URL ?? 'http://localhost:4200/api/auth',
    process.env.IDENTITY_SERVER_DOMAIN ?? 'https://identity-server.dev01.devland.is',
  )
}

async function session(session: AuthSession, user: AuthUser) {
  console.log('[nextauth] session ' + session)
  session.accessToken = user.accessToken
  session.idToken = user.idToken
  const decoded = decode(session.accessToken)
  console.log(decoded)
  console.log('session access token ' + session.accessToken)
  if (
    decoded &&
    !(typeof decoded === 'string') &&
    decoded['exp'] &&
    decoded['scope']
  ) {
    session.expires = JSON.stringify(new Date(decoded.exp * 1000))
    session.scope = decoded.scope
  }
  console.log(session)
  return session
}

const options = { providers, callbacks, pages }

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('look at me')
  console.log('next auth req, ', { req })
  NextAuth(req, res, options)
}