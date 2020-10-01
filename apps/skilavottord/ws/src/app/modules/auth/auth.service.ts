import { Injectable } from '@nestjs/common'

import { Role, AuthUser } from './auth.types'

const DEVELOPERS = [
  /* Deloitte */
  '2811638099', // Tómas
  '0301665909', // Sigurgeir
]

const ADMINS = [
  /* Stafrænt Ísland */
  '1903795829', // Örvar
]

const TESTERS = [
  /* Stafrænt Ísland */
  '1903795829', // Örvar
]

@Injectable()
export class AuthService {
  getRole(user: AuthUser): Role {
    if (DEVELOPERS.includes(user.nationalId)) {
      return 'developer'
    } else if (ADMINS.includes(user.nationalId)) {
      return 'admin'
    } else if (TESTERS.includes(user.nationalId)) {
      return 'tester'
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
}
