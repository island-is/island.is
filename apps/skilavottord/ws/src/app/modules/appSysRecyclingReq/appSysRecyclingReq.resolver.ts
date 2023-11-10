import { Query, Resolver } from '@nestjs/graphql'
import { AppSysRecyclingReqService } from './appSysRecyclingReq.service'
import { AppSysVehicleInformation } from './appSysRecyclingReq.model'

// @Authorize()
@Resolver(() => AppSysVehicleInformation)
export class AppSysRecyclingReqResolver {
  constructor(private appSysRecyclingReqService: AppSysRecyclingReqService) {}

  @Query(() => [AppSysVehicleInformation])
  async skilavottordAppSysVehicles(): Promise<Array<AppSysVehicleInformation>> {
    console.log('------------ NEW ENDPOINT HITTTT  1242 ------------------')
    return this.appSysRecyclingReqService.getUserVehiclesInformation()
  }
}
