import { Inject } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize } from '../auth'
import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'

@Resolver(() => AccessControlModel)
export class AccessControlResolver {
  constructor(
    private accessControlService: AccessControlService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => [AccessControlModel])
  async skilavottordAccessControls(): Promise<AccessControlModel[]> {
    const res = await this.accessControlService.findAll()
    this.logger.info(
      'skilavottordAllAccessControl response:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  @Mutation(() => AccessControlModel)
  async createSkilavottordAccessControl(
    // TODO: change to inputs
    @Args('partnerId', { nullable: true }) partnerId: string,
  ): Promise<typeof AccessControlModel> {
    return this.accessControlService.createAccess(partnerId)
  }

  @Mutation(() => AccessControlModel)
  async updateSkilavottordAccessControl(
    // TODO: change to inputs
    @Args('partnerId', { nullable: true }) partnerId: string,
  ): Promise<typeof AccessControlModel> {
    return this.accessControlService.updateAccess(partnerId)
  }
}
