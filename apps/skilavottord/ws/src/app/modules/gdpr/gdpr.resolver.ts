import { Inject } from '@nestjs/common'
import { Query, Resolver, Float, Args } from '@nestjs/graphql'
import { GdprService } from './gdpr.service'
import { GdprModel } from '../models'
// import { GdprService } from './models'

@Resolver(() => GdprModel)
export class GdprResolver {
  constructor(@Inject(GdprService) private gdprService: GdprService) {}

  @Query(() => Float)
  uptime() {
    return process.uptime()
  }

  @Query(() => [GdprModel])
  async gdprs(): Promise<GdprModel[]> {
    return await this.gdprService.findAll()
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
