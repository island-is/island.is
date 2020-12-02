import { Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User as TUser } from '@island.is/judicial-system/types'

import { CurrentUser, JwtAuthGuard } from '../auth'
import { User } from './user.model'

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => User, { nullable: true })
  async user(@CurrentUser() user: TUser): Promise<User | undefined> {
    this.logger.debug('Getting current user')

    return user as User
  }
}
