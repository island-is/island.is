import { User } from '.'

export class userService {
  userList: User[] = new Array()

  constructor() {
    this.userList.push(new User('1111111111', 'Ringo', '1111111'))
    this.userList.push(new User('2222222222', 'Lennon', '2222222'))
    this.userList.push(new User('3333333333', 'McCartney', '3333333'))
    this.userList.push(new User('4444444444', 'Harrison', '4444444'))
  }

  getUserList(): User[] {
    return this.userList
  }

  getUserBynationalId(nId: string): User {
    return this.userList.find((e) => e.nationalId === nId)
  }
}
