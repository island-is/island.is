import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

import { GraphQLContext, User, Credentials } from '../../types'
import { Permissions } from './types'
import { environment } from '../../environments'

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
      return [
        '1501933119', // Darri
        '2101932009', // David
        '2501893469', // Brian
        '2607862299', // Þórhildur
        '1903795829', // Örvar
      ].includes(user.ssn)
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

    if (!context.user?.ssn) {
      throw new AuthenticationError('Unauthorized')
    }

    if (!checkPermissions(context.user, permissions)) {
      throw new ForbiddenError('Forbidden')
    }

    return originalValue.apply(this, args)
  }
}
