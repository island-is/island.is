import { Injectable } from '@nestjs/common'
import { environment } from '../../../environments'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'

const { userList } = environment.skilavottord
@Injectable()
export class AuthService {
  constructor() {}
  // TODO
  getRole(user: AuthUser): Role {
    try {
      // this.logger.info('getRole start...')
      const ulist = JSON.parse(userList)
      const picked = ulist.find((o) => o.nationalId === user.nationalId)
      //TODO if not found
      // this.logger.info('getRole return value:' + picked.role)
      return picked.role as Role
    } catch (error) {
      // this.logger.error('getRole exception:' + error.message)
      console.log('getRole exception:' + error.message)
    }
  }

  // get user role
  getUserRole(user: AuthUser): User {
    try {
      // this.logger.info('getUserRole start...')
      const ulist = JSON.parse(userList)
      const picked = ulist.find((o) => o.nationalId === user.nationalId)
      if (!picked) {
        let u = user as User
        u.role = 'citizen'
        return u
      } else {
        return picked
      }
    } catch (error) {
      // this.logger.error('getUserRole exception.' + error.message)
      console.log('getUserRole exception.' + error.message)
    }
  }

  // check role
  // checkRole(user: AuthUser, role: Role): boolean {
  //   const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
  //   if (!picked) {
  //     return false
  //   } else {
  //     const r = picked.role as Role
  //     return (
  //       r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
  //     )
  //   }
  //   return false
  // }
  // check role
  checkRole(user: AuthUser, role: Role): boolean {
    // this.logger.info('checkRole for user start...')
    try {
      const ulist = JSON.parse(userList)
      const picked = ulist.find((o) => o.nationalId === user.nationalId)
      if (!picked) {
        // this.logger.info('checkRole user not found in userList')
        return false
      } else {
        const r = picked.role as Role
        // this.logger.info('checkRole user found in userList. user role:' + r)
        return (
          r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
        )
      }
      // this.logger.info('checkRole return default false')
      return false
    } catch (err) {
      // this.logger.error('checkRole exeption in auth.service:' + err.message)
      return false
    }
  }

  // test
  static test(): string {
    return 'test'
  }
}
