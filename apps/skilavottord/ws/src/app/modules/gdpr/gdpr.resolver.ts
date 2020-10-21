import { Inject } from '@nestjs/common'
import { Query, Resolver, Float, Args } from '@nestjs/graphql'
import { GdprService } from './gdpr.service'
import { GdprModel } from './model/gdpr.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Resolver(() => GdprModel)
export class GdprResolver {
  constructor(
    @Inject(GdprService) private gdprService: GdprService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Query(() => [GdprModel])
  async getAllGdprs(): Promise<GdprModel[]> {
    const res = this.gdprService.findAll()
    this.logger.debug('getAllGdrps responce:' + JSON.stringify(res, null, 2))
    return res
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
