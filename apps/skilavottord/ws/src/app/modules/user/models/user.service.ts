import { User } from '.'
import { Car } from '../../car'

export class UserService {
  userList: User[]

  carList: Car[]

  constructor() {
    this.userList = []
    this.carList = []
    this.carList.push(new Car('Jkd-912', 'Nissan', 'Arya', 'white'))
    this.userList.push(
      new User('1111111111', 'Óðinn Jónsson', '1111111', this.carList),
    )
    this.carList = []
    this.carList.push(new Car('Xll-732', 'Nissan', 'Leaf', 'blue'))
    this.carList.push(new Car('Dtx-429', 'Tesla', 'model-2', 'red'))
    this.userList.push(
      new User('2222222222', 'Þór Gunnarsson', '2222222', this.carList),
    )
    this.carList = []
    this.carList.push(new Car('Dty-432', 'Volo', 'v-60', 'white'))
    this.carList.push(new Car('Hjm-549', 'Suzuki', 'jimny', 'blue'))
    this.userList.push(
      new User('3333333333', 'Freyja Jónsdóttir', '3333333', this.carList),
    )
    this.carList = []
    this.carList.push(new Car('Ujn-881', 'Bmw', 'i-8', 'black'))
    this.carList.push(new Car('Ukb-141', 'Benz', 'G-63', 'black'))
    this.userList.push(
      new User('4444444444', 'Loki Sigurðdsson', '4444444', this.carList),
    )
  }

  getUserList(): User[] {
    return this.userList
  }

  getUserBynationalId(nId: string): User {
    return this.userList.find((e) => e.nationalId === nId)
  }
}
