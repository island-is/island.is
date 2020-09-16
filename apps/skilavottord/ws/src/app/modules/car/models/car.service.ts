import { Car } from '.'

export class CarService {
  carList: Car[]

  getUserList(): Car[] {
    return this.carList
  }

  getCarById(permno: string): Car {
    return this.carList.find((e) => e.permno === permno)
  }
}
