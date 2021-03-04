import { Inject, Injectable } from '@nestjs/common'
import { environment } from '../../../environments'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

const { userList } = environment.skilavottord

@Injectable()
export class AuthService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}
  // TODO
  getRole(user: AuthUser): Role {
    try {
      this.logger.info('getRole start...')
      const ulist = JSON.parse(userList)
      const picked = ulist.find((o) => o.nationalId === user.nationalId)
      //TODO if not found
      this.logger.info('getRole return value:' + picked.role)
      return picked.role as Role
    } catch (error) {
      this.logger.error('getRole exception:' + error.message)
    }
  }

  // //TODO
  // getUserRoleNew(user: AuthUser): User {
  //   const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
  //   let curruser = new User()
  //   // curruser.nationalId = user.nationalId
  //   if (!picked) {
  //     // curruser.role = 'citizen'
  //   } else {
  //     // curruser.role = picked.role
  //     // curruser.partnerId = picked.partnerId
  //   }
  //   return null
  // }

  // get user role
  getUserRole(user: AuthUser): User {
    this.logger.info('getUserRole start...')
    const ulist = JSON.parse(userList)
    const picked = ulist.find((o) => o.nationalId === user.nationalId)
    return picked
  }

  // check role
  checkRole(user: AuthUser, role: Role): boolean {
    this.logger.info('checkRole for user start...')
    try {
      const ulist = JSON.parse(userList)
      const picked = ulist.find((o) => o.nationalId === user.nationalId)
      if (!picked) {
        this.logger.info('checkRole user not found in userList')
        return false
      } else {
        const r = picked.role as Role
        this.logger.info('checkRole user found in userList. user role:' + r)
        return (
          r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
        )
      }
      this.logger.info('checkRole return default false')
      return false
    } catch (err) {
      this.logger.error('checkRole exeption in auth.service:' + err.message)
    }
  }

  // test
  static test(): string {
    return 'test'
  }
}
