import { Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { VehicleRestInformation } from './samgongustofaRest.model'
import { SamgongustofaRestService } from './samgongustofaRest.service'
import { UseGuards } from '@nestjs/common'

// @Authorize()
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleRestInformation)
export class SamgongustofaRestResolver {
  constructor(private samgongustofaRestService: SamgongustofaRestService) {
    console.log('HUMMMM')
  }

  @Query(() => [VehicleRestInformation])
  async skilavottordRestVehicles(): Promise<Array<VehicleRestInformation>> {
    console.log('------------ NEW ENDPOINT HITTTT  09485 ------------------')

    return this.samgongustofaRestService.getUserVehiclesInformation(
      '3012755609',
    )
  }

  // @Query(() => [VehicleInformation])
  // async skilavottordVehicles(
  //   @CurrentUser() user: User,
  // ): Promise<Array<VehicleInformation>> {
  //   return this.samgongustofaService.getUserVehiclesInformation(user.nationalId)
  // }
}
