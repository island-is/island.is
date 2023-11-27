import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CurrentUser, User } from '../auth'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { CreateOwnerInput } from './dto/createOwner.input'
import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerService } from './vehicleOwner.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerAppSysResolver {
  constructor(private vehicleOwnerService: VehicleOwnerService) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleOwnerAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateOwnerInput,
  ): Promise<boolean> {
    const vm = new VehicleOwnerModel()
    vm.nationalId = user.nationalId
    vm.personname = input.name
    return await this.vehicleOwnerService.create(vm)
  }
}
