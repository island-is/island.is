import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AllowedFakeUsers,
  ApplicationState,
  CurrentApplication,
  HomeCircumstances,
} from '@island.is/financial-aid/shared'
import type { User } from '@island.is/financial-aid/shared'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/financial-aid/auth'

import { UserModel } from './user.model'
import { UserService } from './user.service'

import { CurrentApplicationModel } from '../application'
import { environment } from '../../../environments'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => UserModel, { nullable: true })
  async currentUser(
    @CurrentGraphQlUser() user: User,
  ): Promise<UserModel | undefined> {
    this.logger.debug('Getting current user')

    return user as UserModel
  }

  @ResolveField('currentApplication', () => CurrentApplicationModel)
  async currentApplication(
    @Parent() user: User,
  ): Promise<CurrentApplicationModel | null> {
    // Local development
    if (
      environment.auth.allowFakeUsers &&
      AllowedFakeUsers.includes(user.nationalId)
    ) {
      return this.fakeUser(user.nationalId)
    }
    return await this.userService.getCurrentApplication(user.nationalId)
  }

  fakeUser(nationalId: string) {
    const fakeUsers: { [key: string]: CurrentApplication } = {
      '0000000001': {
        id: '00000',
        state: ApplicationState.INPROGRESS,
        homeCircumstances: HomeCircumstances.OWNPLACE,
        usePersonalTaxCredit: true,
      },
      '0000000003': {
        id: '00000',
        state: ApplicationState.DATANEEDED,
        homeCircumstances: HomeCircumstances.OWNPLACE,
        usePersonalTaxCredit: true,
      },
    }

    if (nationalId in fakeUsers) {
      return fakeUsers[nationalId]
    }

    return null
  }
}
