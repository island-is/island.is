import { User } from '.'

export class UserService {
  userList: User[]

  getUserList(): User[] {
    return this.userList
  }

  getUserBynationalId(nId: string): User {
    console.log(' --- getUserBynationalId starting')
    return this.userList.find((e) => e.nationalId === nId)
  }
}
