import { useContext } from 'react'
import { BffContext } from './BffContext'
import { AuthContext } from '@island.is/auth/react'

/**
 * This hook is used to get the authentication context.
 * It will determine what context to use based on the context that is available.
 * We will remove support for AuthContext when other clients transition over to BFF.
 */
export const useAuth = () => {
  const bffContext = useContext(BffContext)
  const authContext = useContext(AuthContext)

  if (bffContext) {
    return bffContext
  } else if (authContext) {
    return authContext
  } else if (!bffContext) {
    throw new Error('useAuth must be used within a BffProvider')
  }

  throw new Error('useAuth must be used within a AuthProvider')
}

/**
 * This hook is used to get user information.
 * It will determine what context to use based on the context that is available.
 * We will remove support for AuthContext when other clients transition over to BFF.
 */
export const useUserInfo = () => {
  const bffContext = useContext(BffContext)
  const authContext = useContext(AuthContext)

  if (bffContext?.userInfo) {
    return bffContext.userInfo
  } else if (authContext?.userInfo) {
    return authContext.userInfo
  }

  throw new Error('User info is not available. Is the user authenticated?')
}
