import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { UserAdviceResultService } from './userAdvice.services'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ConsultationPortalScope } from '@island.is/auth/scopes'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserAdviceResultResolver {
  constructor(private userAdviceResultService: UserAdviceResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserAdviceAggregate, {
    name: 'consultationPortalAllUserAdvices',
  })
  @UseGuards(IdsUserGuard)
  @Scopes(ConsultationPortalScope.default)
  async getAllUserAdvices(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetUserAdvicesInput })
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const userAdvices = await this.userAdviceResultService.getAllUserAdvices(
      user,
      input,
    )
    return userAdvices
  }
}
