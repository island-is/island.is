import { Injectable } from '@nestjs/common'
import { environment } from '../../../environments'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  roleArr: [User]
  constructor() {
    const { userList } = environment.skilavottord
    this.roleArr = JSON.parse(userList)
  }
  // TODO old
  // getRole(user: AuthUser): Role {
  //   var picked = roleArr.find((o) => o.nationalId === user.nationalId)
  //   //TODO if not found
  //   return picked.role as Role
  // }

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
    const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
    return picked
  }

  // check role
  checkRole(user: AuthUser, role: Role): boolean {
    const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
    if (!picked) {
      return false
    } else {
      const r = picked.role as Role
      return (
        r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
      )
    }
    return false
  }
}
