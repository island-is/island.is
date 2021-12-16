import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard, User, CurrentUser } from '@island.is/auth-nest-tools'

import { VehicleInformation } from './samgongustofa.model'
import { SamgongustofaService } from './samgongustofa.service'

@UseGuards(IdsUserGuard)
@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(private samgongustofaService: SamgongustofaService) {}

  @Query(() => [VehicleInformation])
  async skilavottordVehicles(
    @CurrentUser() user: User,
  ): Promise<Array<VehicleInformation>> {
    return this.samgongustofaService.getVehicleInformation(user.nationalId)
  }
}
