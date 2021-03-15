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
    // console.log(
    //   '-userListEnv---->' + JSON.stringify(AuthService.userListEnv, null, 2),
    // )
    if (!AuthService.instance) {
      AuthService.instance++
      AuthService.loadArray()
    }
    // console.log('-DEVELOPERS' + JSON.stringify(AuthService.DEVELOPERS))
    // console.log('-RECYCLINGFUND' + JSON.stringify(AuthService.RECYCLINGFUND))
    // console.log(
    //   '-RECYCLINGCOMPANY' + JSON.stringify(AuthService.RECYCLINGCOMPANY),
    // )
  }
  getRole(user: AuthUser): Role {
    if (AuthService.RECYCLINGCOMPANY.includes(user.nationalId)) {
      return 'recyclingCompany'
    } else if (AuthService.RECYCLINGFUND.includes(user.nationalId)) {
      return 'recyclingFund'
    } else if (AuthService.DEVELOPERS.includes(user.nationalId)) {
      return 'developer'
    } else {
      return 'citizen'
    }
  }

  checkRole(user: AuthUser, role: Role): boolean {
    switch (role) {
      case 'recyclingCompany':
        return AuthService.RECYCLINGCOMPANY.includes(user.nationalId)
      case 'recyclingFund':
        return AuthService.RECYCLINGFUND.includes(user.nationalId)
      case 'developer':
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
      if (user.role == 'developer') {
        AuthService.DEVELOPERS.push(user.nationalId)
      } else if (user.role == 'recyclingFund') {
        AuthService.RECYCLINGFUND.push(user.nationalId)
      } else if (user.role == 'recyclingCompany') {
        AuthService.RECYCLINGCOMPANY.push(user.nationalId)
      }
    })
    // console.log('-DEVELOPERS' + JSON.stringify(AuthService.DEVELOPERS))
    // console.log('-RECYCLINGFUND' + JSON.stringify(AuthService.RECYCLINGFUND))
    // console.log(
    //   '-RECYCLINGCOMPANY' + JSON.stringify(AuthService.RECYCLINGCOMPANY),
    // )
  }

  // TODO test
  getPartnerId(nationalId: string): string {
    const userFound = AuthService.userListEnv.find(
      (user) => nationalId === user.nationalId,
    )
    if (userFound) {
      // console.log(
      //   'getPatnerId:user found,partnerId(' + userFound.partnerId + ')',
      // )
      return userFound.partnerId
    } else {
      // console.log('getPatnerId: user.partnerId not found return null')
      return null
    }
  }
}

// TODO implement in getPartnerId
// if (
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111'
// ) {
//   currUser.partnerId = '104' // This is partner Id for Hringras, to be fixed later
// } else if (
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111' ||
//   currUser.nationalId === '1111111111'
// ) {
//   currUser.partnerId = '221' // This is partner Id for Fura, to be fixed later
// } else if (
//   currUser.role === 'recyclingCompany' ||
//   currUser.role === 'developer'
// ) {
//   currUser.partnerId = '110' // This is partner Id for Vaka, to be fixed later (no need list vaka users)
// } else {
//   currUser.partnerId = null // Normal citizen user
// }
