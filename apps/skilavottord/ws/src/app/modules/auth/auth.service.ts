import { Injectable } from '@nestjs/common'
import { environment } from '../../../environments'
import { User } from '../user'
import { Role, AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  static userListTest: [User] = JSON.parse(environment.skilavottord.userList)
  constructor() {
    console.log('----->' + JSON.stringify(AuthService.userListTest, null, 2))
  }
  // // TODO
  // getRole(user: AuthUser): Role {
  //   const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
  //   //TODO if not found
  //   return picked.role as Role
  // }

  // TODO
  getRole(user: AuthUser): Role {
    try {
      // this.logger.info('getRole start...')
      console.log('getRole start...')
      // const ulist = JSON.parse(userList)
      const picked = AuthService.userListTest.find(
        (o) => o.nationalId === user.nationalId,
      )
      //TODO if not found
      // this.logger.info('getRole return value:' + picked.role)
      console.log('getRole return value:' + picked.role)
      return picked.role as Role
    } catch (error) {
      // this.logger.error('getRole exception:' + error.message)
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
    try {
      // this.logger.info('getUserRole start...')
      console.log('getUserRole start...')
      // const ulist = JSON.parse(userList)
      // const ulist = this.userListTest
      const picked = AuthService.userListTest.find(
        (o) => o.nationalId === user.nationalId,
      )
      if (!picked) {
        console.log('getUserRole user not found in list => user is citizen')
        let u = user as User
        u.role = 'citizen'
        console.log('getUserRole return user:' + JSON.stringify(u, null, 2))
        return u
      } else {
        console.log('getUserRole user found in list return user')
        console.log(
          'getUserRole return user:' + JSON.stringify(picked, null, 2),
        )
        return picked
      }
    } catch (error) {
      // this.logger.error('getUserRole exception.' + error.message)
      console.log('getUserRole exception.' + error.message)
    }
  }

  // // get user role
  // getUserRole(user: AuthUser): User {
  //   const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
  //   return picked
  // }

  // // check role
  // checkRole(user: AuthUser, role: Role): boolean {
  //   /*const picked = this.roleArr.find((o) => o.nationalId === user.nationalId)
  //   if (!picked) {
  //     return false
  //   } else {
  //     const r = picked.role as Role
  //     return (
  //       r === 'developer' || r === 'recyclingCompany' || r === 'recyclingFund'
  //     )
  //   }*/
  //   return true
  // }

  // check role
  checkRole(user: AuthUser, role: Role): boolean {
    // this.logger.info('checkRole for user start...')
    console.log('checkRole for user start...')
    try {
      console.log('ulist->' + JSON.stringify(AuthService.userListTest, null, 2))
      // const ulist = JSON.parse(userList)
      // console.log('ulist->' + JSON.stringify(ulist, null, 2))
      const picked = AuthService.userListTest.find(
        (o) => o.nationalId === user.nationalId,
      )
      if (!picked) {
        // this.logger.info('checkRole user not found in userList')
        console.log('checkRole user not found in userList return false')
        return false
      } else {
        const r = picked.role as Role
        // this.logger.info('checkRole user found in userList. user role:' + r)
        console.log('checkRole user found in userList. user role:' + r)
        if (r == 'developer') {
          console.log('checkRole user er developer return true')
          return true
        } else if (r == 'recyclingFund') {
          console.log('checkRole user er recyclingFund return true')
          return true
        } else if (r == 'recyclingCompany') {
          console.log('checkRole user er recyclingCompany return true')
          return true
        } else {
          console.log('checkRole return default false')
          return false
        }
      }
    } catch (err) {
      // this.logger.error('checkRole exeption in auth.service:' + err.message)
      console.log('checkRole exeption in auth.service:' + err.message)
      return false
    }
  }

  // test
  static test(): string {
    return 'test'
  }
}
