import { useContext } from 'react'
import { BffContext } from './BffContext'

export const useAuth = () => {
  const context = useContext(BffContext)

  if (!context) {
    throw new Error('useAuth must be used within a BffProvider')
  }

  return context
}

export const useUserInfo = () => {
  const context = useContext(BffContext)

  if (!context?.userInfo) {
    throw new Error('User info is not available. Is the user authenticated?')
  }

  return context.userInfo
}
