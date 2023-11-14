import { Args, Resolver, Mutation } from '@nestjs/graphql'

import { Authorize, CurrentUser, User } from '../auth'

import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerService } from './vehicleOwner.service'

@Authorize()
@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerAppSysResolver {
  constructor(private vehicleOwnerService: VehicleOwnerService) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleOwnerAppSys(
    @CurrentUser() user: User,
    @Args('name') name: string,
  ) {
    const vm = new VehicleOwnerModel()
    vm.nationalId = user.nationalId
    // vm.nationalId = '1234567890'
    vm.personname = name
    return await this.vehicleOwnerService.create(vm)
  }
}
