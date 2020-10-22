import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
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
  async getAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestService.findAll()
    logger.debug(
      'getAllRecyclingRequests responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
