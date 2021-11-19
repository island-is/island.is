import {
  Query,
  Resolver,
  Context,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { MunicipalityModel } from './models'
import {
  MunicipalityActivityInput,
  CreateMunicipalityInput,
  MunicipalityQueryInput,
  UpdateMunicipalityInput,
} from './dto'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import type { Municipality, Staff } from '@island.is/financial-aid/shared/lib'
import { StaffModel } from '../staff/models'

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
  ): Promise<Municipality> {
    this.logger.debug(`Getting municipality ${input.id}`)

    return backendApi.getMunicipality(input.id)
  }

  @Mutation(() => MunicipalityModel, { nullable: false })
  activityMunicipality(
    @Args('input', { type: () => MunicipalityActivityInput })
    input: MunicipalityActivityInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Municipality> {
    const { id, ...activityMunicipality } = input

    this.logger.debug('Updating activity municipality')

    return backendApi.updateActivityMunicipality(id, activityMunicipality)
  }

  @Mutation(() => MunicipalityModel, { nullable: false })
  createMunicipality(
    @Args('input', { type: () => CreateMunicipalityInput })
    input: CreateMunicipalityInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<MunicipalityModel> {
    this.logger.debug('Creating municipality')
    return backendApi.createMunicipality(input)
  }

  @Mutation(() => MunicipalityModel, { nullable: false })
  updateMunicipality(
    @Args('input', { type: () => UpdateMunicipalityInput })
    input: UpdateMunicipalityInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Municipality> {
    this.logger.debug('Updating municipality')

    return backendApi.updateMunicipality(input)
  }

  @Query(() => [MunicipalityModel], { nullable: false })
  municipalities(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Municipality[]> {
    this.logger.debug(`Getting municipalities`)

    return backendApi.getMunicipalities()
  }

  @ResolveField('numberOfUsers', () => Number)
  numberOfUsers(
    @Parent() municipality: MunicipalityModel,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<number> {
    this.logger.debug(
      `Getting number of users for ${municipality.municipalityId}`,
    )

    return backendApi.getNumberOfStaffForMunicipality(
      municipality.municipalityId,
    )
  }

  @ResolveField('adminUsers', () => [StaffModel])
  adminUsers(
    @Parent() municipality: MunicipalityModel,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Staff[]> {
    this.logger.debug(`Getting admin users for ${municipality.municipalityId}`)

    return backendApi.getAdminUsers(municipality.municipalityId)
  }
}
