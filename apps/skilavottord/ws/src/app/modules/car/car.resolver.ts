import { Query, Resolver, Args } from '@nestjs/graphql'
import { Authorize } from '../auth'
import { Car } from './models'
import { CarService } from './models/car.service'

//TODO remove
@Resolver(() => Car)
export class CarResolver {
  carService: CarService

  constructor() {
    this.carService = new CarService()
  }

  @Authorize()

  //Test
  //query b {getCarById(id: "2"){id, ownerId, name, model}}
  //@Query(() => Car)
  getCar(@Args('id') nid: string): Car {
    return this.carService.getCarById(nid)
  }

  //deregisterVehicle
  @Query(() => Car)
  deregisterVehicle(@Args('car') car: Car): Car {
    //car.recyclingStatus = "Done"
    return car
  }
}
