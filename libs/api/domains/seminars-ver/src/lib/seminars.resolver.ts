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
import { ValidateSeminarIndividualsInput } from './dto/individuals.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Scopes(ApiScope.vinnueftirlitid)
@Audit({ namespace: '@island.is/api/seminars-ver' })
export class SeminarsResolver {
  constructor(private readonly seminarsService: SeminarsService) {}

  @Query(() => CompanyValidationItem, { name: 'seminarsVerIsCompanyValid' })
  @Audit()
  async isCompanyValid(
    @CurrentUser() auth: User,
    @Args('nationalId') nationalId: string,
  ) {
    return this.seminarsService.isCompanyValid(auth, nationalId)
  }

  @Query(() => [IndividualValidationItem])
  @Audit()
  async areIndividualsValid(
    @CurrentUser() auth: User,
    @Args('input') input: ValidateSeminarIndividualsInput,
    @Args('courseID', { type: () => String }) courseID: string,
    @Args('nationalIdOfRegisterer', { type: () => String, nullable: true })
    nationalIdOfRegisterer?: string,
  ) {
    return this.seminarsService.checkIndividuals(
      auth,
      input.individuals,
      courseID,
      nationalIdOfRegisterer,
    )
  }
}
