import { User } from '.'

export class UserService {
  userList: User[]

  getUserList(): User[] {
    return this.userList
  }

  getUserBynationalId(nId: string): User {
    return this.userList.find((e) => e.nationalId === nId)
  }
}
