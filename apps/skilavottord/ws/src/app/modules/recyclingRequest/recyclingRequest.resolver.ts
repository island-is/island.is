import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize, Role, CurrentUser } from '../auth'
import { VehicleModel } from '../vehicle'
import type { User } from '../auth'
import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
  RecyclingRequestResponse,
} from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'

@Authorize()
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    private recyclingRequestService: RecyclingRequestService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Authorize({ roles: [Role.developer, Role.recyclingFund] })
  @Query(() => [RecyclingRequestModel])
  async skilavottordAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestService.findAll()
    this.logger.info(
      'skilavottordAllRecyclingRequests response:' +
        JSON.stringify(res, null, 2),
    )
    return res
  }

  @Query(() => [RecyclingRequestModel])
  async skilavottordRecyclingRequest(
    @Args('permno') perm: string,
  ): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestService.findAllWithPermno(perm)
    this.logger.info(
      'skilavottordRecyclingRequest responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => Boolean)
  async skilavottordDeRegisterVehicle(
    @Args('vehiclePermno') nid: string,
    @Args('recyclingPartner') station: string,
  ): Promise<boolean> {
    return this.recyclingRequestService.deRegisterVehicle(nid, station)
  }

  @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => VehicleModel)
  async skilavottordVehicleReadyToDeregistered(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    return this.recyclingRequestService.getVehicleInfoToDeregistered(permno)
  }

  @Mutation(() => RecyclingRequestResponse)
  async createSkilavottordRecyclingRequest(
    @CurrentUser() user: User,
    @Args({ name: 'requestType', type: () => RecyclingRequestTypes })
    requestType: RecyclingRequestTypes,
    @Args('permno') permno: string,
    @Args('nameOfRequestor', { nullable: true }) name: string,
    @Args('partnerId', { nullable: true }) partnerId: string,
  ): Promise<typeof RecyclingRequestResponse> {
    return this.recyclingRequestService.createRecyclingRequest(
      user.nationalId,
      requestType,
      permno,
      name,
      partnerId,
    )
  }
}
