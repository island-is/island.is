import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { ApiKeysModel } from './models'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import type { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import { CreateApiKeyInput } from './dto'

@UseGuards(IdsUserGuard)
@Resolver(() => ApiKeysModel)
export class ApiKeysResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [ApiKeysModel], { nullable: false })
  apiKeysForMunicipality(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApiKeysForMunicipality[]> {
    this.logger.debug(`Getting municipalities by ids`)
    return backendApi.getApiKeys()
  }

  @Mutation(() => ApiKeysModel, { nullable: false })
  createApiKey(
    @Args('input', { type: () => CreateApiKeyInput })
    input: CreateApiKeyInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApiKeysForMunicipality> {
    this.logger.debug('Creating api key for municipality')
    return backendApi.createApiKey(input)
  }
}
