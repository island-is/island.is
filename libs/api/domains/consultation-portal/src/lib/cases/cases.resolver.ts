import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CaseResultService } from './cases.service'
import { CaseResult } from '../models/caseResult.model'
import { CaseItemResult } from '../models/caseItemResult.model'
import { AdviceResult } from '../models/adviceResult.model'

@Resolver()
export class CaseResultResolver {
  constructor(private caseResultService: CaseResultService) {}

  @Query(() => [CaseItemResult], { name: 'consultationPortalAllCases' })
  async getAllCases(): Promise<CaseItemResult[]> {
    return await this.caseResultService.getAllCases()
  }

  @Query(() => CaseResult, { name: 'consultationPortalCaseById' })
  async getCase(@Args('caseId') caseId: number): Promise<CaseResult> {
    return await this.caseResultService.getCase(caseId)
  }

  @Query(() => [AdviceResult], { name: 'consultationPortalAdviceByCaseId' })
  async getAdvices(@Args('caseId') caseId: number): Promise<string[]> {
    const advices = await this.caseResultService.getAdvices(caseId)
    return advices.map((advice) => advice.content as string)
  }

  @Mutation(() => CaseResult, { name: 'postConsultationPortalAdvice' })
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
