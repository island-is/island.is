import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql'

import { Inject, UseInterceptors } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { MunicipalityModel } from './models'
import { MunicipalityQueryInput } from './dto'

import {
  Municipality,
  MunicipalitySettings,
} from '@island.is/financial-aid/types'

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
}
