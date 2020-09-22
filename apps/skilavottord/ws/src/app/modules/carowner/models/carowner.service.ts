import { Carowner } from '.'
import { Car } from '../../car'

export class CarownerService {
  carownerList: Carowner[]

  carList: Car[]

  constructor() {
    this.carownerList = []
    this.carList = []
    this.carList.push(
      new Car('Jkd-912', 'Nissan leaf', 'white', '20-03-2015', false),
    )
    this.carownerList.push(
      new Carowner('1111111111', 'Óðinn Jónsson', '1111111', this.carList),
    )
    this.carList = []
    this.carList.push(
      new Car('Xll-732', 'Nissan leaf', 'blue', '15-02-2014', true),
    )
    this.carList.push(
      new Car('Dtx-429', 'Tesla model-3', 'red', '11-04-2020', false),
    )
    this.carownerList.push(
      new Carowner('2222222222', 'Þór Gunnarsson', '2222222', this.carList),
    )
    this.carList = []
    this.carList.push(
      new Car('Dty-432', 'Volo v-60', 'white', '30-12-2005', true),
    )
    this.carList.push(
      new Car('Hjm-549', 'Suzuki jimny', 'blue', '02-02-2019', true),
    )
    this.carownerList.push(
      new Carowner('3333333333', 'Freyja Jónsdóttir', '3333333', this.carList),
    )
    this.carList = []
    this.carList.push(
      new Car('Ujn-881', 'Bmw i-8', 'black', '19-08-2018', true),
    )
    this.carList.push(
      new Car('Ukb-141', 'Benz g-63', 'black', '05-11-2001', false),
    )
    this.carownerList.push(
      new Carowner('4444444444', 'Loki Sigurðsson', '4444444', this.carList),
    )
  }

  getCaronwerList(): Carowner[] {
    return this.carownerList
  }

  getVehiclesForNationalId(nId: string): Carowner {
    return this.carownerList.find((e) => e.nationalId === nId)
  }
}
