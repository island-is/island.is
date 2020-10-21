import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'

@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    @Inject(RecyclingRequestService)
    private recyclingRequestService: RecyclingRequestService,
  ) {}

  @Query(() => [RecyclingRequestModel])
  async getAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestService.findAll()
    console.log('res->' + JSON.stringify(res, null, 2))
    return res
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
