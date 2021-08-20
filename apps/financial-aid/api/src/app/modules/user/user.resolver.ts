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
import { UserService } from './user.service'

import { ActiveApplicationModel } from '../application'

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

  // @ResolveField('hasAppliedForPeriod', () => boolean, { nullable: true })
  // async hasAppliedForPeriod(@Parent() user: User): Promise<boolean> {
  //   console.log('here is apsssssp')
  //   const app = await this.userService.checkHasAppliedForPeriod(user.nationalId)
  //   console.log(app, 'here is app')
  //   if (app != null) {
  //     return true
  //   }
  //   return false
  // }

  @ResolveField('activeApplication', () => [ActiveApplicationModel])
  async activeApplication(
    @Parent() user: User,
  ): Promise<ActiveApplicationModel[]> {
    const app = await this.userService.checkHasAppliedForPeriod(user.nationalId)
    return app
  }
}
