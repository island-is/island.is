import React, { FC } from 'react'

import { createMockUser, MockUser } from '../createMockUser'

import { AuthContext, defaultAuthContext } from './AuthContext'

interface MockedAuthenticatorProps {
  user?: MockUser
  signOut?: () => void
  switchUser?: (nationalId?: string) => void
}

export const MockedAuthenticator: FC<MockedAuthenticatorProps> = ({
  children,
  signOut,
  switchUser,
  user,
}) => {
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
