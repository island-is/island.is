import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'

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
    private readonly backendApi: BackendAPI,
  ) {}

  @Query(() => [ApiKeysModel], { nullable: false })
  apiKeysForMunicipality(): Promise<ApiKeysForMunicipality[]> {
    this.logger.debug(`Getting municipalities by ids`)
    return this.backendApi.getApiKeys()
  }

  @Mutation(() => ApiKeysModel, { nullable: false })
  createApiKey(
    @Args('input', { type: () => CreateApiKeyInput })
    input: CreateApiKeyInput,
  ): Promise<ApiKeysForMunicipality> {
    this.logger.debug('Creating api key for municipality')
    return this.backendApi.createApiKey(input)
  }

  @Mutation(() => ApiKeysModel, { nullable: false })
  updateApiKey(
    @Args('input', { type: () => UpdateApiKeyInput })
    input: UpdateApiKeyInput,
  ): Promise<ApiKeysModel> {
    this.logger.debug('Updating api key name')

    return this.backendApi.updateApiKey(input)
  }

  @Mutation(() => DeleteApiKeyResponse, { nullable: false })
  deleteApiKey(
    @Args('input', { type: () => DeleteApiKeyInput })
    input: DeleteApiKeyInput,
  ): Promise<DeleteApiKeyResponse> {
    this.logger.debug(`delete api key ${input.id}`)

    return this.backendApi.deleteApiKey(input.id)
  }
}
