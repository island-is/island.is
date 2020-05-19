import jwt from 'jsonwebtoken'

import { Authorize, User, AuthContext } from './types'
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

const isAdmin = ({ ssn }: User): boolean =>
  ['1501933119', '2101932009'].includes(ssn)

export const authorize = ({ role, permissions }: Authorize) => {
  return function(
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalValue = descriptor.value

    descriptor.value = function(...args: any[]) {
      const context = args.length === 4 && (args[2] as AuthContext)

      if (!context) {
        throw new Error('Only use this decorator for graphql resolvers.')
      }

      if (!context.user?.ssn) {
        throw new Error('Not authorized!')
      }

      if (!isAdmin) {
        throw new Error('Admin access needed!')
      }

      return originalValue.apply(this, args)
    }
  }
}
