import { Query, Resolver, Context, Args, Mutation } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { MunicipalityModel } from './models'
import { MunicipalityQueryInput, UpdateMunicipalityInput } from './dto'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver(() => MunicipalityModel)
export class MunicipalityResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => MunicipalityModel, { nullable: false })
  municipality(
    @Args('input', { type: () => MunicipalityQueryInput })
    input: MunicipalityQueryInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<MunicipalityModel> {
    this.logger.debug(`Getting municipality ${input.id}`)

    return backendApi.getMunicipality(input.id)
  }

  @Mutation(() => MunicipalityModel, { nullable: false })
  updateMunicipality(
    @Args('input', { type: () => UpdateMunicipalityInput })
    input: UpdateMunicipalityInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<MunicipalityModel> {
    this.logger.debug('Updating municipality')

    return backendApi.updateMunicipality(input)
  }
}
