import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
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

@Resolver(() => CaseResult)
export class CaseResolver {
  constructor(private caseService: CaseResultService) {}

  @Query(() => [CaseResult], { name: 'consulationPortalCaseResult' })
  async getCases(@CurrentUser() user: User): Promise<CaseResult[]> {
    return this.caseService.getAllCases()
  }
}
