import { Context, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User as TUser } from '@island.is/judicial-system/types'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { User } from './user.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [User], { nullable: true })
  users(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<User[]> {
    this.logger.debug('Getting all users')

    return backendApi.getUsers()
  }

  @Query(() => User, { nullable: true })
  async user(@CurrentGraphQlUser() user: TUser): Promise<User | undefined> {
    this.logger.debug('Getting current user')

    return user as User
  }
}
