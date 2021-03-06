import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

import { GraphQLContext, User, Credentials } from '../../types'
import { Permissions } from './types'
import { environment } from '../../environments'

const {
  accessGroups: { developers = '', admins = '', testers = '' },
} = environment

const DEVELOPERS = developers.split(',')
const ADMINS = admins.split(',')
const TESTERS = testers.split(',')

export const verifyToken = (token: string): Promise<Credentials | null> => {
  const { jwtSecret } = environment.auth
  return new Promise((resolve) =>
    jwt.verify(token as string, jwtSecret, (err, decoded: Credentials) => {
      if (!err) {
        resolve(decoded)
      } else {
        resolve(null)
      }
    }),
  )
}

export const getRole = (user: User): Permissions['role'] => {
  if (DEVELOPERS.includes(user.ssn)) {
    return 'developer'
  } else if (ADMINS.includes(user.ssn)) {
    return 'admin'
  } else if (TESTERS.includes(user.ssn)) {
    return 'tester'
  } else {
    return 'user'
  }
}

const checkPermissions = (user: User, { role }: Permissions): boolean => {
  switch (role) {
    case 'developer':
      return DEVELOPERS.includes(user.ssn)
    case 'admin':
      return [...ADMINS, ...DEVELOPERS].includes(user.ssn)
    case 'tester':
      return false
    default: {
      if (role) {
        return false
      }
      return true
    }
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
