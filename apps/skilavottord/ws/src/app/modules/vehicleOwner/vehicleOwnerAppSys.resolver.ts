import { Args, Resolver, Mutation } from '@nestjs/graphql'

import { Authorize, CurrentUser, User } from '../auth'

import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerService } from './vehicleOwner.service'
import { CreateOwnerInput } from './dto/createOwner.input'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

//@Authorize()
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerAppSysResolver {
  constructor(private vehicleOwnerService: VehicleOwnerService) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleOwnerAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateOwnerInput,
  ) {
    console.log('createSkilavottordVehicleOwnerAppSys', input.name)
    console.log('user', user)
    console.log('NATIONAL ID', user.nationalId.replace('**REMOVE_PII:', ''))

    const vm = new VehicleOwnerModel()
    vm.nationalId = user.nationalId
    vm.personname = input.name
    return await this.vehicleOwnerService.create(vm)
  }
}
