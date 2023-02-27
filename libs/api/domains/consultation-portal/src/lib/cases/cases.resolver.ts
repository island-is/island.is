import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
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

  // @Query(() => [CaseItemResult])
  // async getCases(): Promise<CaseItemResult[]> {
  //   return await this.caseResultService.getCase()
  // }

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
// @UseGuards(IdsUserGuard)
// @Resolver(() => CaseResult)
// export class CaseResolver {
//   constructor(private caseService: CaseResultService) {}

//   @Query(() => [CaseResult], { name: 'consultationPortalAllCases' })
//   async getCases(): Promise<CaseResult[]> {
//     return this.caseService.getAllCases()
//   }
//   // @Query(() => [CaseResult], { name: 'consultationPortalAllCases' })
//   // async getCase(id): Promise<CaseResult> {
//   //   return this.caseService.getAllCases()
//   // }
// }
