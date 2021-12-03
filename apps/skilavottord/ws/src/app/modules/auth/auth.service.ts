import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  static instance = 0
  static DEVELOPERS = []
  static RECYCLINGCOMPANY = []
  static RECYCLINGFUND = []
  static userListEnv: [User] = JSON.parse(environment.skilavottord.userList)
  constructor() {
    if (!AuthService.instance) {
      AuthService.instance++
      AuthService.loadArray()
    }
  }
  getRole(user: AuthUser): Role {
    if (AuthService.RECYCLINGCOMPANY.includes(user.nationalId)) {
      return Role.recyclingCompany
    } else if (AuthService.RECYCLINGFUND.includes(user.nationalId)) {
      return Role.recyclingFund
    } else if (AuthService.DEVELOPERS.includes(user.nationalId)) {
      return Role.developer
    } else {
      return Role.citizen
    }
  }

  checkRole(user: AuthUser, role: Role): boolean {
    switch (role) {
      case Role.recyclingCompany:
        return AuthService.RECYCLINGCOMPANY.includes(user.nationalId)
      case Role.recyclingFund:
        return AuthService.RECYCLINGFUND.includes(user.nationalId)
      case Role.developer:
        return AuthService.DEVELOPERS.includes(user.nationalId)
      default: {
        if (role) {
          return false
        }
        return true
      }
    }
  }

  static loadArray() {
    AuthService.userListEnv.forEach((user) => {
      if (user.role == Role.developer) {
        AuthService.DEVELOPERS.push(user.nationalId)
      } else if (user.role == Role.recyclingFund) {
        AuthService.RECYCLINGFUND.push(user.nationalId)
      } else if (user.role == Role.recyclingCompany) {
        AuthService.RECYCLINGCOMPANY.push(user.nationalId)
      }
    })
  }

  // TODO test
  getPartnerId(nationalId: string): string {
    const userFound = AuthService.userListEnv.find(
      (user) => nationalId === user.nationalId,
    )
    if (userFound) {
      return userFound.partnerId
    } else {
      return null
    }
  }
}
