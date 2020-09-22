import { Query, Resolver, Args } from '@nestjs/graphql'
import { Carowner } from './models'
import { CarownerService } from './models/carowner.service'

@Resolver(() => Carowner)
export class CarownerResolver {
  carownerService: CarownerService

  constructor() {
    this.carownerService = new CarownerService()
  }

  //query b {getUserByNationalId(nationalId: "2222222222"){name, mobile}}
  //getCarownerByNationalId(@Args('nationalId') nid: string): Carowner {
  @Query(() => Carowner)
  getVehiclesForNationalId(@Args('nationalId') nid: string): Carowner {
    return this.carownerService.getVehiclesForNationalId(nid)
  }
}
