import { Resolver, Context, Mutation, Args } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BackendAPI } from '../../../services'

import { Amount } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CreateAmountInput } from './dto'
import { AmountModel } from './models'

@UseGuards(IdsUserGuard)
@Resolver(() => AmountModel)
export class AmountResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => AmountModel, { nullable: true })
  createAmount(
    @Args('input', { type: () => CreateAmountInput })
    input: CreateAmountInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Amount> {
    this.logger.debug('Creating amount')

    return backendApi.createAmount(input)
  }
}
