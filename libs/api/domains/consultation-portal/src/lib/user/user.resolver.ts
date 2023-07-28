import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { UserService } from './user.service'
import { UserEmailResult } from '../models/userEmailResult.model'
import { UserSubscriptionsAggregate } from '../models/userSubscriptionsAggregate.model'
import { PostEmailCommand } from '../models/postEmailCommand.model'
import { PostSubscriptionTypeInput } from '../dto/postSubscriptionType.input'
import { Audit } from '@island.is/nest/audit'

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.samradsgatt)
@FeatureFlag(Features.consultationPortalApplication)
@Audit({ namespace: '@island.is/samradsgatt' })
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
  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostUserEmail',
  })
  async postUserEmail(
    @CurrentUser() user: User,
    @Args('input', { type: () => PostEmailCommand }) input: PostEmailCommand,
  ): Promise<void> {
    const response = await this.userService.postUserEmail(user, input)
    return response
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

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostSubscriptions',
  })
  async postUserSubscriptions(
    @CurrentUser() user: User,
    @Args('input', { type: () => PostSubscriptionTypeInput })
    input: PostSubscriptionTypeInput,
  ): Promise<void> {
    const response = await this.userService.postUserSubscriptions(user, input)
    return response
  }
}
