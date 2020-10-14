import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { Role, AuthUser } from './auth.types'

const {
  accessGroups: { developers = '', admins = '' },
} = environment

const DEVELOPERS = developers.split(',')
const ADMINS = admins.split(',')

@Injectable()
export class AuthService {
  getRole(user: AuthUser): Role {
    if (DEVELOPERS.includes(user.nationalId)) {
      return 'developer'
    } else if (ADMINS.includes(user.nationalId)) {
      return 'admin'
    } else {
      return 'user'
    }
  }

  checkRole(user: AuthUser, role: Role): boolean {
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
}
