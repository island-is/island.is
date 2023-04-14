import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ConsultationPortalScope } from '@island.is/auth/scopes'
import { UserService } from './user.service'
import { UserEmailResult } from '../models/userEmailResult.model'
import { UserSubscriptionsAggregate } from '../models/userSubscriptionsAggregate.model'

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard)
@Scopes(ConsultationPortalScope.default)
@FeatureFlag(Features.consultationPortalApplication)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserAdviceAggregate, {
    name: 'consultationPortalAllUserAdvices',
  })
  async getAllUserAdvices(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetUserAdvicesInput })
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const userAdvices = await this.userService.getAllUserAdvices(user, input)
    return userAdvices
  }

  @Query(() => UserEmailResult, {
    name: 'consultationPortalUserEmail',
  })
  async getUserEmail(@CurrentUser() user: User): Promise<UserEmailResult> {
    const userEmail = await this.userService.getUserEmail(user)

    return userEmail
  }

  @Query(() => UserSubscriptionsAggregate, {
    name: 'consultationPortalUserSubscriptions',
  })
  async getUserSubscriptions(
    @CurrentUser() user: User,
  ): Promise<UserSubscriptionsAggregate> {
    const response = await this.userService.getUserSubscriptions(user)
    return response
  }
}
