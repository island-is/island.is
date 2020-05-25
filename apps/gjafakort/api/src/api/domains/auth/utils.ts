import jwt from 'jsonwebtoken'

import { Permissions, User, AuthContext } from './types'
import { environment } from '../../../environments/environment'

export const verifyToken = (token: string): User | null => {
  if (!token) {
    return null
  }

  const { jwtSecret } = environment.auth
  let user: User | null = null
  jwt.verify(token as string, jwtSecret, (err, decoded) => {
    if (!err) {
      user = decoded as User
    }
  })

  return user
}

const checkPermissions = (user: User, { role }: Permissions): boolean => {
  switch (role) {
    case 'admin':
      return ['1501933119', '2101932009'].includes(user.ssn)
    default:
      return true
  }
}

export const authorize = (permissions: Permissions) => (
  target: Record<string, any>,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalValue = descriptor.value

  descriptor.value = (...args: any[]) => {
    const context = args.length === 4 && (args[2] as AuthContext)

    if (!context) {
      throw new Error('Only use this decorator for graphql resolvers.')
    }

    if (!context.user?.ssn || !checkPermissions(context.user, permissions)) {
      return () => null
    }

    return originalValue.apply(this, args)
  }
}
