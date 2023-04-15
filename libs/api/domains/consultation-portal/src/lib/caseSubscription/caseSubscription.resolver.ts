import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CaseSubscriptionService } from './caseSubscription.service'
import { PostCaseSubscriptionCommand } from '../models/postCaseSubscriptionsCommand.model'
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

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.samradsgatt)
export class CaseSubscriptionResolver {
  constructor(private caseSubscriptionService: CaseSubscriptionService) {}

  @Query(() => [CaseSubscriptionResult], {
    name: 'consultationPortalSubscriptionType',
  })
  @FeatureFlag(Features.consultationPortalApplication)
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
  @FeatureFlag(Features.consultationPortalApplication)
  async postCaseSubscriptionType(
    @CurrentUser() user: User,
    @Args('PostCaseSubscriptionCommand', {
      type: () => PostCaseSubscriptionCommand,
    })
    PostCaseSubscriptionCommand: PostCaseSubscriptionCommand,
    @Args('caseId') caseId: number,
  ): Promise<void> {
    const response = await this.caseSubscriptionService.postCaseSubscriptionType(
      user,
      caseId,
      PostCaseSubscriptionCommand,
    )
    return response
  }

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostSubscriptionType',
  })
  @FeatureFlag(Features.consultationPortalApplication)
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
}
