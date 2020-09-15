import { Car } from '.'

export class CarService {
  carList: Car[]

  getUserList(): Car[] {
    return this.carList
  }

  getCarById(id: string): Car {
    return this.carList.find((e) => e.id === id)
  }
}
