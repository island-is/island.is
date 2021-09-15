import { Query, Resolver, Context, Args } from '@nestjs/graphql'

import { Inject } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'
import { StaffModel } from './models'
import { StaffQueryInput } from './dto'

@Resolver(() => StaffModel)
export class StaffResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}
  @Query(() => StaffModel, { nullable: false })
  getStaff(
    @Args('input', { type: () => StaffQueryInput })
    input: StaffQueryInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<StaffModel> {
    this.logger.debug(`Getting staff ${input.nationalId}`)

    return backendApi.getStaff(input.nationalId)
  }
}
