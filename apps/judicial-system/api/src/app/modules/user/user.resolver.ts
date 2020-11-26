import { Query, Resolver, Context } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CurrentAuthUser, AuthUser, JwtAuthGuard } from '../auth'
import { User } from './user.model'
import { BackendAPI } from '../../../services'

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => User, { nullable: true })
  async user(
    @CurrentAuthUser() authUser: AuthUser,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<User | undefined> {
    this.logger.debug('Getting current user')

    if (!authUser) {
      return undefined
    }

    return backendApi.getUser(authUser.nationalId)
  }
}
