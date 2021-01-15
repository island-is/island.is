/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession, signIn, signOut } from 'next-auth/client'
import { NextPageContext } from 'next'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withAuthentication = (next: any) => async (
  context: NextPageContext,
) => {
  const session = await getSession(context)
  if (isExpired(session)) {
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

const isExpired = (session: any): boolean => {
  return !session || new Date() > new Date(session.expires)
}

export const isLoggedIn = (session: any, loading: boolean): boolean => {
  return !isExpired(session) && !loading
}

export const login = async () => {
  signIn('identity-server')
}

export const logout = (session: any) => {
  session &&
    signOut({
      callbackUrl: `${window.location.origin}/api/auth/logout?id_token=${session.idToken}`,
    })
}
