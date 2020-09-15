import { Carowner } from '.'
import { Car } from '../../car'

export class CarownerService {
  carownerList: Carowner[]

  carList: Car[]

  constructor() {
    this.carownerList = []
    this.carList = []
    this.carList.push(new Car('Jkd-912', 'Nissan', 'Arya', 'white'))
    this.carownerList.push(
      new Carowner('1111111111', 'Óðinn Jónsson', '1111111', this.carList),
    )
    this.carList = []
    this.carList.push(new Car('Xll-732', 'Nissan', 'Leaf', 'blue'))
    this.carList.push(new Car('Dtx-429', 'Tesla', 'model-2', 'red'))
    this.carownerList.push(
      new Carowner('2222222222', 'Þór Gunnarsson', '2222222', this.carList),
    )
    this.carList = []
    this.carList.push(new Car('Dty-432', 'Volo', 'v-60', 'white'))
    this.carList.push(new Car('Hjm-549', 'Suzuki', 'jimny', 'blue'))
    this.carownerList.push(
      new Carowner('3333333333', 'Freyja Jónsdóttir', '3333333', this.carList),
    )
    this.carList = []
    this.carList.push(new Car('Ujn-881', 'Bmw', 'i-8', 'black'))
    this.carList.push(new Car('Ukb-141', 'Benz', 'G-63', 'black'))
    this.carownerList.push(
      new Carowner('4444444444', 'Loki Sigurðsson', '4444444', this.carList),
    )
  }

  getUserList(): Carowner[] {
    return this.carownerList
  }

  getUserBynationalId(nId: string): Carowner{
    return this.carownerList.find((e) => e.nationalId === nId)
  }
}
