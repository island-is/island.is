import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import {
  RecyclingRequestModel,
  RecyclingRequestUnion,
} from './model/recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'
import { logger, Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { Authorize, AuthService, CurrentUser, AuthUser } from '../auth'

@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    @Inject(RecyclingRequestService)
    private recyclingRequestService: RecyclingRequestService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => [RecyclingRequestModel])
  async skilavottordAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestService.findAll()
    logger.info(
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
    logger.info(
      'skilavottordRecyclingRequest responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  @Query(() => Boolean)
  async skilavottordDeRegisterVehicle(
    @Args('vehiclePermno') nid: string,
    @Args('recyclingPartner') station: string,
  ): Promise<boolean> {
    return this.recyclingRequestService.deRegisterVehicle(nid, station)
  }

  @Query(() => VehicleModel)
  async skilavottordVehicleReadyToDeregistered(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    return this.recyclingRequestService.getVehicleInfoToDeregistered(permno)
  }

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
