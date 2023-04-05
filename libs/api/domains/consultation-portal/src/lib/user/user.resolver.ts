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

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard)
@Scopes(ConsultationPortalScope.default)
export class UserResolver {
  constructor(private userService: UserService) {}

  @FeatureFlag(Features.consultationPortalApplication)
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

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserEmailResult, {
    name: 'consultationPortalUserEmail',
  })
  async getUserEmail(@CurrentUser() user: User): Promise<UserEmailResult> {
    const userEmail = await this.userService.getUserEmail(user)

    return userEmail
  }
}
