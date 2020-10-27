import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { GdprService } from './gdpr.service'
import { GdprModel } from './model/gdpr.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Resolver(() => GdprModel)
export class GdprResolver {
  constructor(
    @Inject(GdprService) private gdprService: GdprService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Mutation((returns) => Boolean)
  async setGDPRInfo(
    @Args('nationalId') nationalId: string,
    @Args('gdprStatus') gdprStatus: string,
  ): Promise<boolean> {
    await this.gdprService.createGdpr(nationalId, gdprStatus)
    return true
  }

  @Query(() => GdprModel)
  async getGDPRInfo(@Args('nationalId') nid: string): Promise<GdprModel> {
    return await this.gdprService.findByNationalId(nid)
  }

  @Query(() => [GdprModel])
  async getAllGdprs(): Promise<GdprModel[]> {
    const res = this.gdprService.findAll()
    this.logger.debug('getAllGdrps responce:' + JSON.stringify(res, null, 2))
    return res
  }
}
