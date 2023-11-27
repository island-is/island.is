import { Query, Resolver } from '@nestjs/graphql'
import { AppSysRecyclingReqService } from './appSysRecyclingReq.service'
import { AppSysVehicleInformation } from './appSysRecyclingReq.model'
import { UseGuards } from '@nestjs/common'
import { ScopesGuard, Scopes, IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@urvinnslusjodur.is/skilavottord')
@Resolver(() => AppSysVehicleInformation)
export class AppSysRecyclingReqResolver {
  constructor(private appSysRecyclingReqService: AppSysRecyclingReqService) {}

  @Query(() => [AppSysVehicleInformation])
  async skilavottordAppSysVehicles(): Promise<Array<AppSysVehicleInformation>> {
    return this.appSysRecyclingReqService.getUserVehiclesInformation()
  }
}
