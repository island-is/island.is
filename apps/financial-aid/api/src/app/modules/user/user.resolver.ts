import { Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Staff, User } from '@island.is/financial-aid/shared/lib'

import { UserModel } from './user.model'

import { StaffModel } from '../staff/models'
import { BackendAPI } from '../../../services'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { SpouseModel } from './spouseModel.model'
import { CurrentUser } from '../decorators/currentUser.decorator'

@UseGuards(IdsUserGuard)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendApi: BackendAPI,
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

  @ResolveField('spouse', () => SpouseModel)
  async spouse(): Promise<SpouseModel> {
    return await this.backendApi.getSpouse()
  }

  @ResolveField('currentApplicationId', () => String)
  async currentApplicationId(): Promise<string | undefined> {
    this.logger.debug('Getting current application for nationalId')
    return await this.handleNotFoundException(() =>
      this.backendApi.getCurrentApplicationId(),
    )
  }

  @ResolveField('staff', () => StaffModel, { name: 'staff', nullable: true })
  async staff(): Promise<Staff | undefined> {
    this.logger.debug('Getting staff for nationalId')
    return await this.backendApi.getStaff()
  }
}
