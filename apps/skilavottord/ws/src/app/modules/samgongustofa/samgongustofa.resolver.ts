import { Query, Resolver, Args } from '@nestjs/graphql'

import { Authorize, CurrentUser, User } from '../auth'

import { VehicleInformation } from './samgongustofa.model'
import { SamgongustofaService } from './samgongustofa.service'

// @Authorize()
@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(private samgongustofaService: SamgongustofaService) {
    console.log('HUMMMM')
  }

  @Query(() => [VehicleInformation])
  async skilavottordVehicles(): Promise<Array<VehicleInformation>> {
    console.log(
      '------------ SKILAVOTTORD ENDPOINT HITTTT  1536 ------------------',
    )

    return this.samgongustofaService.getUserVehiclesInformation('3012755609')
  }

  // @Query(() => [VehicleInformation])
  // async skilavottordVehicles(
  //   @CurrentUser() user: User,
  // ): Promise<Array<VehicleInformation>> {
  //   return this.samgongustofaService.getUserVehiclesInformation(user.nationalId)
  // }
}
