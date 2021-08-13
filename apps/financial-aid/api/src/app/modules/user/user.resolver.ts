import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { User } from '@island.is/financial-aid/shared'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/financial-aid/auth'

import { UserModel } from './user.model'
import { boolean } from 'yargs'
import { UserService } from './user.service'

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

  @ResolveField('hasAppliedForPeriod', () => boolean)
  async hasAppliedForPeriod(@Parent() user: User): Promise<boolean> {
    return await this.userService.checkUserHistory(user.nationalId)
  }
}
