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

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/seminars-ver' })
export class SeminarsResolver {
  constructor(private readonly seminarsService: SeminarsService) {}

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => CompanyValidationItem, { name: 'seminarsVerIsCompanyValid' })
  @Audit()
  async isCompanyValid(
    @CurrentUser() auth: User,
    @Args('nationalId') nationalId: string,
  ) {
    return this.seminarsService.isCompanyValid(auth, nationalId)
  }
}
