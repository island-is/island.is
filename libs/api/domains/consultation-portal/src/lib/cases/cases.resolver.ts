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
import { GetCaseAdviceInput, GetCaseInput } from '../dto/case.input'
import { GetCasesInput } from '../dto/cases.input'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class CaseResultResolver {
  constructor(private caseResultService: CaseResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => [CaseItemResult], { name: 'consultationPortalAllCases' })
  async getAllCases(): Promise<CaseItemResult[]> {
    return await this.caseResultService.getAllCases()
  }

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => [CaseItemResult], { name: 'consultationPortalGetCases' })
  async getCases(
    @Args('input', { type: () => GetCasesInput }) input: GetCasesInput,
  ): Promise<CaseItemResult[]> {
    return await this.caseResultService.getCases(input)
  }

  @Query(() => CaseResult, { name: 'consultationPortalCaseById' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getCase(
    @Args('input', { type: () => GetCaseInput }) input: GetCaseInput,
  ): Promise<CaseResult> {
    return await this.caseResultService.getCase(input)
  }

  @Query(() => [AdviceResult], { name: 'consultationPortalAdviceByCaseId' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getAdvices(
    @Args('input', { type: () => GetCaseInput }) input: GetCaseInput,
  ): Promise<AdviceResult[]> {
    const advices = await this.caseResultService.getAdvices(input)
    return advices
  }

  @Mutation(() => CaseResult, { name: 'postConsultationPortalAdvice' })
  @FeatureFlag(Features.consultationPortalApplication)
  async postAdvice(
    @Args('input', { type: () => GetCaseAdviceInput })
    input: GetCaseAdviceInput,
  ): Promise<void> {
    const response = await this.caseResultService.postAdvice({
      caseId: input.caseId,
      content: input.content,
      // files: input.files,
    })
    return response
  }
}
