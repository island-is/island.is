import { Args, Resolver, Mutation } from '@nestjs/graphql'

import { Authorize, CurrentUser, User } from '../auth'

import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerService } from './vehicleOwner.service'

//@Authorize()
@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerAppSysResolver {
  constructor(private vehicleOwnerService: VehicleOwnerService) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleOwnerAppSys(
    @CurrentUser() user: User,
    @Args('name') name: string,
  ) {
    console.log('createSkilavottordVehicleOwnerAppSys', name)
    console.log('user', user)
    const vm = new VehicleOwnerModel()
    vm.nationalId = user.nationalId
    vm.personname = name
    return await this.vehicleOwnerService.create(vm)
  }
}
