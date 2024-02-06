import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { ApiKeysModel, DeleteApiKeyResponse } from './models'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import type { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import { CreateApiKeyInput, DeleteApiKeyInput, UpdateApiKeyInput } from './dto'

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

  @Mutation(() => ApiKeysModel, { nullable: false })
  updateApiKey(
    @Args('input', { type: () => UpdateApiKeyInput })
    input: UpdateApiKeyInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApiKeysModel> {
    this.logger.debug('Updating api key name')

    return backendApi.updateApiKey(input)
  }

  @Mutation(() => DeleteApiKeyResponse, { nullable: false })
  deleteApiKey(
    @Args('input', { type: () => DeleteApiKeyInput })
    input: DeleteApiKeyInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApiKeysModel> {
    this.logger.debug('Updating api key name')

    return backendApi.deleteApiKey(input)
  }
}
