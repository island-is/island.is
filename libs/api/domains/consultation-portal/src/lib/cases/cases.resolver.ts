import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CaseResultService } from './cases.service'
import { CaseResult } from '../models/caseResult.model'
import { CaseItemResult } from '../models/caseItemResult.model'
import { AdviceResult } from '../models/adviceResult.model'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class CaseResultResolver {
  constructor(private caseResultService: CaseResultService) {}

  // @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => [CaseItemResult], { name: 'consultationPortalAllCases' })
  async getAllCases(): Promise<CaseItemResult[]> {
    return await this.caseResultService.getAllCases()
  }

  @Query(() => CaseResult, { name: 'consultationPortalCaseById' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getCase(@Args('caseId') caseId: number): Promise<CaseResult> {
    return await this.caseResultService.getCase(caseId)
  }

  @Query(() => [AdviceResult], { name: 'consultationPortalAdviceByCaseId' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getAdvices(@Args('caseId') caseId: number): Promise<string[]> {
    const advices = await this.caseResultService.getAdvices(caseId)
    return advices.map((advice) => advice.content as string)
  }

  @Mutation(() => CaseResult, { name: 'postConsultationPortalAdvice' })
  @FeatureFlag(Features.consultationPortalApplication)
  async postAdvice(
    @Args('caseId') caseId: number,
    @Args('content') content: string,
    @Args('files', { type: () => [String] }) files: Blob[],
  ): Promise<void> {
    const response = await this.caseResultService.postAdvice(
      caseId,
      content,
      files,
    )
    return response
  }
}
