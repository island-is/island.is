import environment from '../../../environments/environment'
import { AuthUser } from './types'
import { Role } from '@island.is/air-discount-scheme/types'

const {
  accessGroups: { developers = '', admins = '' },
} = environment
const DEVELOPERS = developers.split(',')
const ADMINS = admins.split(',')

export function getRole(user: AuthUser): Role {
  if (DEVELOPERS.includes(user.nationalId)) {
    return Role.DEVELOPER
  } else if (ADMINS.includes(user.nationalId)) {
    return Role.ADMIN
  } else {
    return Role.USER
  }
}

export function checkRole(user: AuthUser, role: Role) {
  switch (role) {
    case 'developer':
      return DEVELOPERS.includes(user.nationalId)
    case 'admin':
      return [...ADMINS, ...DEVELOPERS].includes(user.nationalId)
    default: {
      if (role) {
        return false
      }
      return true
    }
  }
}
