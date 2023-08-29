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
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { PostCaseSubscriptionTypeInput } from '../dto/postCaseSubscriptionType.input'
import { GetCaseInput } from '../dto/case.input'
import { Audit } from '@island.is/nest/audit'

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.samradsgatt)
@FeatureFlag(Features.consultationPortalApplication)
@Audit({ namespace: '@island.is/samradsgatt' })
export class CaseSubscriptionResolver {
  constructor(private caseSubscriptionService: CaseSubscriptionService) {}

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalDeleteSubscriptionType',
  })
  async deleteCaseSubscription(
    @Args('input', { type: () => GetCaseInput }) input: GetCaseInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    const response = await this.caseSubscriptionService.deleteCaseSubscription(
      user,
      input,
    )
    return response
  }

  @Query(() => CaseSubscriptionResult, {
    name: 'consultationPortalSubscriptionType',
  })
  async getCaseSubscriptionType(
    @Args('input', { type: () => GetCaseInput }) input: GetCaseInput,
    @CurrentUser() user: User,
  ): Promise<CaseSubscriptionResult> {
    return this.caseSubscriptionService.getCaseSubscriptionType(user, input)
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
    const response =
      await this.caseSubscriptionService.postCaseSubscriptionType(user, input)
    return response
  }
}
