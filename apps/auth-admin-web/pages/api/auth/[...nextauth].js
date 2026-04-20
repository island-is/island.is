import NextAuth from 'next-auth'
import { decode } from 'jsonwebtoken'
import { IdentityServer } from '../../../utils/ids.constants'
import { TokenService } from '../../../services/TokenService'

const providers = [
  {
    id: IdentityServer.id,
    name: IdentityServer.name,
    type: 'oauth',
    wellKnown: `https://${process.env.IDENTITYSERVER_DOMAIN}/.well-known/openid-configuration`,
    clientId: IdentityServer.clientId,
    clientSecret: process.env.IDENTITYSERVER_SECRET,
    authorization: {
      params: { scope: IdentityServer.scope },
    },
    checks: ['pkce', 'state'],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        nationalId: profile.nationalId,
      }
    },
  },
]

const callbacks = {}

callbacks.signIn = async function signIn({ account }) {
  return account.provider === 'identity-server'
}

callbacks.jwt = async function jwt({ token, user, account, profile }) {
  if (account && user) {
    token = {
      ...token,
      nationalId: profile?.nationalId,
      name: user.name,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      idToken: account.id_token,
      isRefreshTokenExpired: false,
    }
  }

  const decoded = decode(token.accessToken)

  if (decoded && typeof decoded !== 'string' && decoded.exp) {
    const expires = new Date(decoded.exp * 1000)
    const renewalTime = new Date(expires.getTime() - 300 * 1000)

    if (new Date() > renewalTime && !token.isRefreshTokenExpired) {
      try {
        const [accessToken, refreshToken] =
          await TokenService.refreshAccessToken(token.refreshToken)

        token.accessToken = accessToken
        token.refreshToken = refreshToken
      } catch (error) {
        console.warn('Error refreshing access token.', error)
        const errorMessage = error?.response?.data?.error
        if (errorMessage && errorMessage === 'invalid_grant') {
          token.isRefreshTokenExpired = true
        }
      }
    }
  }

  return token
}

callbacks.session = async function session({ session, token }) {
  session.accessToken = token.accessToken
  session.idToken = token.idToken
  const decoded = decode(session.accessToken)
  if (decoded && typeof decoded !== 'string' && decoded.exp) {
    session.expires = new Date(decoded.exp * 1000).toISOString()
    session.scope = decoded.scope
  }
  return session
}

const options = {
  providers,
  callbacks,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (req, res) => NextAuth(req, res, options)
