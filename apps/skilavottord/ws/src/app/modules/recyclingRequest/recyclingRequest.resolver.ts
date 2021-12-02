import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { VehicleModel } from '../vehicle'
import { Authorize } from '../auth'
import {
  RecyclingRequestModel,
  RecyclingRequestUnion,
} from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    private recyclingRequestService: RecyclingRequestService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /*
    List for all recycled vehicles
  */
  @Authorize({ roles: ['developer', 'recyclingFund'] })
  @Query(() => [RecyclingRequestModel])
  async skilavottordAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestService.findAll()
    this.logger.info(
      'skilavottordAllRecyclingRequests response:' +
        JSON.stringify(res, null, 2),
    )
    return res
  }

  /*
    All recycled requested on the vehicle
  */
  @Authorize({ roles: ['developer', 'recyclingFund'] })
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

  /*
    Deregistered the vehicle at station
  */
  @Authorize({ roles: ['developer', 'recyclingCompany'] })
  @Query(() => Boolean)
  async skilavottordDeRegisterVehicle(
    @Args('vehiclePermno') nid: string,
    @Args('recyclingPartner') station: string,
  ): Promise<boolean> {
    return this.recyclingRequestService.deRegisterVehicle(nid, station)
  }

  /*
    Is vehicle ready to dispose?
  */
  @Query(() => VehicleModel)
  async skilavottordVehicleReadyToDeregistered(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    return this.recyclingRequestService.getVehicleInfoToDeregistered(permno)
  }

  /*
    Create recycling request log
  */
  @Mutation(() => RecyclingRequestUnion)
  async createSkilavottordRecyclingRequest(
    @Args('requestType') requestType: string,
    @Args('permno') permno: string,
    @Args('nameOfRequestor', { nullable: true }) name: string,
    @Args('partnerId', { nullable: true }) partnerId: string,
  ) {
    return await this.recyclingRequestService.createRecyclingRequest(
      requestType,
      permno,
      name,
      partnerId,
    )
  }
}
