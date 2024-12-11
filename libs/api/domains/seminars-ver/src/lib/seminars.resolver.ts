import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { SeminarsService } from './seminars.service'
import { CompanyValidationItem } from './models/companyValidation'
import { IndividualValidationItem } from './models/individualValidation'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/seminars-ver' })
export class SeminarsResolver {
  constructor(private readonly seminarsService: SeminarsService) {}

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [CompanyValidationItem])
  @Audit()
  async isCompanyValid(
    @CurrentUser() auth: User,
    @Args('nationalId') nationalId: string,
  ) {
    return this.seminarsService.isCompanyValid(auth, nationalId)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [IndividualValidationItem])
  @Audit()
  async areIndividualsValid(
    @CurrentUser() auth: User,
    @Args('nationalIds', { type: () => [String] }) nationalIds: Array<string>,
    @Args('courseID', { type: () => Number }) courseID: number,
  ) {
    return this.seminarsService.checkIndividuals(auth, nationalIds, courseID)
  }
}
