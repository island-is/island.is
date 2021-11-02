import { Context, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BackendAPI } from '../../../services'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { StaffModel } from './models'

@UseGuards(IdsUserGuard)
@Resolver(() => StaffModel)
export class StaffResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [StaffModel], { nullable: false })
  users(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<StaffModel[]> {
    this.logger.debug('Getting all staff for municipality')

    return backendApi.getStaffForMunicipality()
  }
}
