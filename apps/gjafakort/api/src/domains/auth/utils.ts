import jwt from 'jsonwebtoken'

import { GraphQLContext, User, Credentials } from '../../types'
import { Permissions } from './types'
import { environment } from '../../environments/environment'

export const verifyToken = (token: string): Credentials | null => {
  if (!token) {
    return null
  }

  const { jwtSecret } = environment.auth
  return jwt.verify(token as string, jwtSecret, (err, decoded) => {
    if (!err) {
      return decoded
    }
    return null
  })
}

const checkPermissions = (user: User, { role }: Permissions): boolean => {
  switch (role) {
    case 'admin':
      return ['1501933119', '2101932009'].includes(user.ssn)
    default:
      return true
  }
}

export const authorize = (permissions: Permissions = {}) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: Record<string, any>,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalValue = descriptor.value

  descriptor.value = (...args: object[]) => {
    const context = args.length === 4 && (args[2] as GraphQLContext)

    if (!context) {
      throw new Error('Only use this decorator for graphql resolvers.')
    }

    if (!context.user?.ssn || !checkPermissions(context.user, permissions)) {
      return () => null
    }

    return originalValue.apply(this, args)
  }
}
