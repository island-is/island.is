import React, { FC } from 'react'
import { AuthContext, defaultAuthContext } from './AuthContext'
import { createMockUser, MockUser } from '../createMockUser'

interface MockedAuthenticatorProps {
  user?: MockUser
  signOut?: () => void
  switchUser?: (nationalId?: string) => void
}

export const MockedAuthProvider: FC<
  React.PropsWithChildren<MockedAuthenticatorProps>
> = ({ children, signOut, switchUser, user }) => {
  const userInfo = user ? createMockUser(user) : null
  return (
    <AuthContext.Provider
      value={{
        ...defaultAuthContext,
        userInfo,
        ...(switchUser && { switchUser }),
        ...(signOut && { signOut }),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
