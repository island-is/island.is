import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { Carowner } from './models'
import { CarownerService } from './models/carowner.service'
import { DeregisterCarInput } from './models/dto'

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

  @Mutation((returns) => Boolean)
  deregisterCar(
    @Args('deregisterCarInput') dereginput: DeregisterCarInput,
  ): boolean {
    return dereginput.permno === '1'
  }

  @Mutation((returns) => Boolean)
  requestPayment(
    @Args('permno') permno: string,
    @Args('nationalid') nationalid: string,
  ): boolean {
    return permno === '1'
  }
}
