import { Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Role, AuthUser } from './auth.types'

const DEVELOPERS = [
  /* Deloitte */
  '2811638099', // Tómas
 // '0301665909', // Sigurgeir
]

const ADMINS = [
  /* Stafrænt Ísland */
  '1903795829', // Örvar
  '0301665909', // Sigurgeir
]

const TESTERS = [
  /* Stafrænt Ísland */
  '1903795829', // Örvar
]
      console.log(`  - DEVELOPERS = ${DEVELOPERS} `)    

@Injectable()
export class AuthService {
  getRole(user: AuthUser): Role {
     console.log("GetRole")
     console.log(user.nationalId)
     if (DEVELOPERS.includes(user.nationalId)) {
      console.log("Gaurinn er developer") 
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
    console.log("  - checkRole starting")
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
