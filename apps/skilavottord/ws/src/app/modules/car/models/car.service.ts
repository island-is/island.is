import { Car } from '.'

export class CarService {
  carList: Car[]

  constructor() {
    this.carList = []
    this.carList.push(new Car('1', '1111111111', 'Mazda', 'cx-5', 'red'))
    this.carList.push(new Car('2', '1111111111', 'Kia', 'soul', 'white'))
    this.carList.push(new Car('3', '3333333333', 'Toyota', 'rav', 'yellow'))
    this.carList.push(new Car('4', '4444444444', 'Volvo', 'xc-40', 'blue'))
  }

  getUserList(): Car[] {
    return this.carList
  }

  getCarById(id: string): Car {
    return this.carList.find((e) => e.id === id)
  }
}
