import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CaseSubscriptionService } from './caseSubscription.service'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { CaseSubscriptionResult } from '../models/caseSubscriptionResult.model'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { PostCaseSubscriptionTypeInput } from '../dto/postCaseSubscriptionType.input'

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.samradsgatt)
@FeatureFlag(Features.consultationPortalApplication)
export class CaseSubscriptionResolver {
  constructor(private caseSubscriptionService: CaseSubscriptionService) {}

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostSubscriptionType',
  })
  async deleteCaseSubscription(
    @CurrentUser() user: User,
    @Args('caseId') caseId: number,
  ): Promise<void> {
    const response = await this.caseSubscriptionService.deleteCaseSubscription(
      user,
      caseId,
    )
    return response
  }

  @Query(() => [CaseSubscriptionResult], {
    name: 'consultationPortalSubscriptionType',
  })
  async getCaseSubscriptionType(
    @CurrentUser() user: User,
    @Args('caseId') caseId: number,
  ): Promise<CaseSubscriptionResult> {
    return this.caseSubscriptionService.getCaseSubscriptionType(user, caseId)
  }

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostSubscriptionType',
  })
  async postCaseSubscriptionType(
    @Args('input', { type: () => PostCaseSubscriptionTypeInput })
    input: PostCaseSubscriptionTypeInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    const response = await this.caseSubscriptionService.postCaseSubscriptionType(
      user,
      input,
    )
    return response
  }
}
