import { Inject } from '@nestjs/common'
import { Args, Resolver, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize, CurrentUser, User } from '../auth'

import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerService } from './vehicleOwner.service'

@Authorize()
@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerResolver {
  constructor(
    private vehicleOwnerService: VehicleOwnerService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleOwner(
    @CurrentUser() user: User,
    @Args('name') name: string,
  ) {
    const vm = new VehicleOwnerModel()
    vm.nationalId = user.nationalId
    vm.personname = name

    this.logger.info(
      'create new createSkilavottordVehicleOwner...' +
        JSON.stringify(vm, null, 2),
    )
    return await this.vehicleOwnerService.create(vm)
  }
}
