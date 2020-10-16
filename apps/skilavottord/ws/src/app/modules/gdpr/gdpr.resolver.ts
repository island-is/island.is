import { Inject } from '@nestjs/common'
import { Query, Resolver, Float, Args } from '@nestjs/graphql'
import { Gdpr, GdprService } from './models'
// import { GdprService } from './models'

@Resolver(() => Gdpr)
export class GdprResolver {
  constructor(@Inject(GdprService) private gdprService: GdprService) {}

  @Query(() => Float)
  uptime() {
    return process.uptime()
  }

  @Query(() => [Gdpr])
  async gdprs(): Promise<Gdpr[]> {
    return await this.gdprService.findAll()
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
