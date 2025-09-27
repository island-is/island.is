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
  FeatureFlagGuard,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PoliceCasesService } from '../services/police-cases.service'
import { PaginantedCaseCollection } from '../models/police-cases/paginatedCaseCollection.model'
import { Case } from '../models/police-cases/case.model'
import { GetPoliceCaseInput } from '../../dto/getPoliceCaseInput'


@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/police-cases' })
@Scopes(ApiScope.lawAndOrder)
export class PoliceCasesResolver {
  constructor(
    private readonly policeCasesService: PoliceCasesService,
  ) {}

  @Query(() => PaginantedCaseCollection, {
    name: 'lawAndOrderPoliceCasesPaginatedCollection',
    nullable: true,
  })
  @Audit()
  getCasesList(
    @CurrentUser() user: User,
  ) {
    return this.policeCasesService.getCases(user)
  }

  @Query(() => Case, {
    name: 'lawAndOrderPoliceCase',
    nullable: true,
  })
  @Audit()
  getCase(
    @CurrentUser() user: User,
    @Args('input') input: GetPoliceCaseInput,

  ) {
    return this.policeCasesService.getCase(user, input.caseNumber)
  }

}
