import { Query, Resolver } from '@nestjs/graphql'
import { AppSysRecyclingReqService } from './appSysRecyclingReq.service'
import { AppSysVehicleInformation } from './appSysRecyclingReq.model'
import { UseGuards } from '@nestjs/common'
import { ScopesGuard, Scopes, IdsUserGuard } from '@island.is/auth-nest-tools'

import { JWTTokenGuard } from '../auth/jwtToken.guard'

//@Authorize()
//@UseGuards(JWTTokenGuard)
//@Scopes('@urvinnslusjodur.is/skilavottord')
@Resolver(() => AppSysVehicleInformation)
export class AppSysRecyclingReqResolver {
  constructor(private appSysRecyclingReqService: AppSysRecyclingReqService) {}

  //////@Scopes('@island.is/applications/urvinnslusjodur')
  @Query(() => [AppSysVehicleInformation])
  async skilavottordAppSysVehicles(): Promise<Array<AppSysVehicleInformation>> {
    console.log('------------ NEW ENDPOINT HITTTT  1242 ------------------')
    return this.appSysRecyclingReqService.getUserVehiclesInformation()
  }
}
