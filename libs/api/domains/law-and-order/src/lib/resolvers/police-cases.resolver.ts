import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PaginatedCaseCollection } from '../models/police-cases/paginatedCaseCollection.model'
import { Case } from '../models/police-cases/case.model'
import { GetPoliceCaseInput } from '../dto/getPoliceCaseInput'
import type { Locale } from '@island.is/shared/types'
import { PoliceCasesService } from '../services/police-cases.service'
import { CaseTimelineStructure } from '../models/police-cases/caseTimelineStructure.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@FeatureFlag(Features.servicePortalPoliceCasesPageEnabled)
@Audit({ namespace: '@island.is/api/police-cases' })
@Scopes(ApiScope.lawAndOrder)
export class PoliceCasesResolver {
  constructor(private readonly policeCasesService: PoliceCasesService) {}

  @Query(() => PaginatedCaseCollection, {
    name: 'lawAndOrderPoliceCasesPaginatedCollection',
    nullable: true,
  })
  @Audit()
  getCasesList(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.policeCasesService.getCases(user, locale)
  }

  @Query(() => Case, {
    name: 'lawAndOrderPoliceCase',
    nullable: true,
  })
  @Audit()
  getCase(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: GetPoliceCaseInput,
  ) {
    return this.policeCasesService.getCase(user, input.caseNumber, locale)
  }

  @Query(() => CaseTimelineStructure, {
    name: 'lawAndOrderPoliceCaseTimelineStructure',
    nullable: true,
  })
  @Audit()
  getPoliceCaseTimelineStructure(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.policeCasesService.getCaseTimelineStructure(locale)
  }
}
