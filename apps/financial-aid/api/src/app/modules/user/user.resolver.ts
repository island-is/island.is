import { Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/financial-aid/shared/lib'

import { UserModel } from './user.model'

import { CurrentApplicationModel } from '../application'
import { StaffModel } from '../staff/models'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CurrentUser } from '../decorators'
import { BackendAPI } from '../../../services'

@UseGuards(IdsUserGuard)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async handleNotFoundException<T>(callback: () => Promise<T>) {
    try {
      return await callback()
    } catch (e) {
      if (e.extensions.response.status === 404) {
        return undefined
      }
      throw e
    }
  }

  @Query(() => UserModel, { nullable: true })
  async currentUser(@CurrentUser() user: User): Promise<UserModel | undefined> {
    this.logger.debug('Getting current user')
    return user as UserModel
  }

  @ResolveField('currentApplication', () => CurrentApplicationModel)
  async currentApplication(
    @Parent() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<CurrentApplicationModel | undefined> {
    this.logger.debug('Getting current application for nationalId')
    return await this.handleNotFoundException(() =>
      backendApi.getCurrentApplication(user.nationalId),
    )
  }

  @ResolveField('staff', () => StaffModel, { name: 'staff', nullable: true })
  async staff(
    @Parent() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<StaffModel | undefined> {
    this.logger.debug('Getting staff for nationalId')
    return await this.handleNotFoundException(() =>
      backendApi.getStaff(user.nationalId),
    )
  }
}
