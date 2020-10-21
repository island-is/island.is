import { Inject } from '@nestjs/common'
import { Query, Resolver, Float, Args } from '@nestjs/graphql'
import { GdprService } from './gdpr.service'
import { GdprModel } from './model/gdpr.model'
// import { GdprService } from './models'

@Resolver(() => GdprModel)
export class GdprResolver {
  constructor(@Inject(GdprService) private gdprService: GdprService) {}

  @Query(() => [GdprModel])
  async getAllgdprs(): Promise<GdprModel[]> {
    return await this.gdprService.findAll()
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
