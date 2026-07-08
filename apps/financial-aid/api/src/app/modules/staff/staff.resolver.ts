import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BackendAPI } from '../../../services'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { StaffModel } from './models'
import { StaffInput, UpdateStaffInput, CreateStaffInput } from './dto'
import type { Staff } from '@island.is/financial-aid/shared/lib'

@UseGuards(IdsUserGuard)
@Resolver(() => StaffModel)
export class StaffResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendApi: BackendAPI,
  ) {}

  @Query(() => [StaffModel], { nullable: false })
  users(  ): Promise<Staff[]> {
    this.logger.debug('Getting all staff for municipality')

    return this.backendApi.getStaffForMunicipality()
  }

  @Query(() => StaffModel, { nullable: false })
  user(
    @Args('input', { type: () => StaffInput })
    input: StaffInput,  ): Promise<Staff> {
    this.logger.debug(`Getting staff from ${input.id}`)

    return this.backendApi.getStaffById(input.id)
  }

  @Query(() => [StaffModel])
  admins(  ): Promise<Staff[]> {
    this.logger.debug(`Getting all admins`)
    return this.backendApi.getAdmins()
  }

  @Query(() => [StaffModel])
  supervisors(  ): Promise<Staff[]> {
    this.logger.debug(`Getting supervisors`)

    return this.backendApi.getSupervisors()
  }

  @Mutation(() => StaffModel, { nullable: true })
  updateStaff(
    @Args('input', { type: () => UpdateStaffInput })
    input: UpdateStaffInput,  ): Promise<Staff> {
    const { id, ...updateStaff } = input

    this.logger.debug(`updating staff ${id}`)

    return this.backendApi.updateStaff(id, updateStaff)
  }

  @Mutation(() => StaffModel, { nullable: false })
  createStaff(
    @Args('input', { type: () => CreateStaffInput })
    input: CreateStaffInput,  ): Promise<Staff> {
    this.logger.debug('Creating staff')

    return this.backendApi.createStaff(input)
  }
}
