import { Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/financial-aid/shared'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/financial-aid/auth'

import { UserModel } from './user.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
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
}
