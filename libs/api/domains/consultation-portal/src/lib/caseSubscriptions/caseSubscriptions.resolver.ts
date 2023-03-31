import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CaseSubscriptionService } from './caseSubscriptions.service'
import { PostCaseSubscriptionCommand } from '../models/postCaseSubscriptionsCommand.model'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { CaseSubscriptionResult } from '../models/caseSubscriptionResult.model'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class CaseSubscriptionResolver {
  constructor(private caseSubscriptionService: CaseSubscriptionService) {}

  @Query(() => [CaseSubscriptionResult], {
    name: 'consultationPortalSubscriptionType',
  })
  @FeatureFlag(Features.consultationPortalApplication)
  async getCaseSubscriptionType(
    @Args('caseId') caseId: number,
  ): Promise<CaseSubscriptionResult> {
    return this.caseSubscriptionService.getCaseSubscriptionType(caseId)
  }

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostSubscriptionType',
  })
  @FeatureFlag(Features.consultationPortalApplication)
  async postCaseSubscriptionType(
    @Args('PostCaseSubscriptionCommand', {
      type: () => PostCaseSubscriptionCommand,
    })
    PostCaseSubscriptionCommand: PostCaseSubscriptionCommand,
    @Args('caseId') caseId: number,
  ): Promise<void> {
    const response = await this.caseSubscriptionService.postCaseSubscriptionType(
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
  async deleteCaseSubscription(@Args('caseId') caseId: number): Promise<void> {
    const response = await this.caseSubscriptionService.deleteCaseSubscription(
      caseId,
    )
    return response
  }
}
