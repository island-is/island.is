import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation, Int } from '@nestjs/graphql'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'
import { logger, Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    @Inject(RecyclingRequestService)
    private recyclingRequestService: RecyclingRequestService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Query(() => [RecyclingRequestModel])
  async skilavottordAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const rr = new RecyclingRequestModel();
    rr.nameOfRequestor = "aaaaaaax"
    rr.recyclingPartnerId = "8888888888"
    rr.requestType = "pendingVehicle"
    rr.vehicleId = "aes-135"
    rr.save()
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

  @Mutation(() => Boolean)
  async createSkilavottordRecyclingRequest(
    @Args('requestType') requestType: string,
    @Args('permno') permno: string,
    @Args('partnerId', { type: () => Int, nullable: true }) partnerId: number,
  ) {
    await this.recyclingRequestService.createRecyclingRequest(
      requestType,
      permno,
      partnerId,
    )
    return true
  }
}
