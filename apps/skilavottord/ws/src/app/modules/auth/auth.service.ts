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
    const ulist = JSON.parse(userList)
    const picked = ulist.find((o) => o.nationalId === user.nationalId)
    //TODO if not found
    return picked.role as Role
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
    const ulist = JSON.parse(userList)
    const picked = ulist.find((o) => o.nationalId === user.nationalId)
    return picked
  }

  // check role
  checkRole(user: AuthUser, role: Role): boolean {
    try {
      const ulist = JSON.parse(userList)
      const picked = ulist.find((o) => o.nationalId === user.nationalId)
      if (!picked) {
        return false
      } else {
        const r = picked.role as Role
        return (
          r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
        )
      }
      return false
    } catch (err) {
      console.log('exeption in auth.service checkRole:' + err.message)
    }
  }

  // test
  static test(): string {
    return 'test'
  }
}
