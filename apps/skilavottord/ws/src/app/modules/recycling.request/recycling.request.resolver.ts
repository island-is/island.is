import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { RecyclingRequestService } from './recycling.request.service'
import { RecyclingRequestModel } from '../models'

@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    @Inject(RecyclingRequestService)
    private recyclingRequestService: RecyclingRequestService,
  ) {}

  @Query(() => [RecyclingRequestModel])
  async getAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    return await this.recyclingRequestService.findAll()
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
