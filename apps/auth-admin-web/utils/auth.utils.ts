import { getSession, signIn, signOut } from 'next-auth/client'
import { NextPageContext } from 'next'
import { SessionInfo } from '../entities/common/SessionInfo'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withAuthentication = (
  next: (context: NextPageContext) => Promise<any>,
) => async (context: NextPageContext) => {
  const session = ((await getSession(context)) as unknown) as SessionInfo

  console.info('withAuthentication -', session.refreshToken)

  if (isExpired(session)) {
    console.info('withAuthentication - isExpired -', session.refreshToken)
    const { res } = context
    if (res) {
      res.statusCode = 302
      res.setHeader('Location', '/')
      return {
        props: {},
      }
    }
    throw new Error('Missing response from context')
  }

  return next(context)
}

const isExpired = (session: SessionInfo): boolean => {
  return !session || new Date() > new Date(session.expires)
}

export const isLoggedIn = (session: SessionInfo, loading: boolean): boolean => {
  return !isExpired(session) && !loading
}

export const login = async () => {
  signIn('identity-server')
}

export const logout = (session: SessionInfo) => {
  session &&
    signOut({
      callbackUrl: `${window.location.origin}/api/auth/logout?id_token=${session.idToken}`,
    })
}
