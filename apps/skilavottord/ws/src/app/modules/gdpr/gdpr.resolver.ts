import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize, CurrentUser } from '../auth'
import type { User } from '../auth'
import { GdprService } from './gdpr.service'
import { GdprModel } from './gdpr.model'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => GdprModel)
export class GdprResolver {
  constructor(
    private gdprService: GdprService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Mutation((_) => Boolean)
  async createSkilavottordGdpr(
    @CurrentUser() user: User,
    @Args('gdprStatus') gdprStatus: string,
  ): Promise<boolean> {
    await this.gdprService.createGdpr(user.nationalId, gdprStatus)
    return true
  }

  @Query(() => GdprModel)
  async skilavottordGdpr(@CurrentUser() user: User): Promise<GdprModel> {
    return await this.gdprService.findByNationalId(user.nationalId)
  }

  @Query(() => [GdprModel])
  async skilavottordAllGdprs(): Promise<GdprModel[]> {
    const res = this.gdprService.findAll()
    this.logger.info('getAllGdrps responce:' + JSON.stringify(res, null, 2))
    return res
  }
}
