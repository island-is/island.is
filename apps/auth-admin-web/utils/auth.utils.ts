import { signIn, signOut } from 'next-auth/client'
import { SessionInfo } from '../entities/common/SessionInfo'

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
      callbackUrl: `${window.location.origin}/admin/api/auth/logout?id_token=${session.idToken}`,
    })
}
