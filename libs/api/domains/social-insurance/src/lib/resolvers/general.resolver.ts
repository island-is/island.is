import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { Countries } from '../models/general/countries.model'
import { EducationalInstitutions } from '../models/general/educationalInstitutions.model'
import { UnionModel } from '../models/general/union.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class GeneralResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => [UnionModel], { name: 'socialInsuranceUnions' })
  async siaGetUnions(@CurrentUser() user: User) {
    return this.service.getUnions(user)
  }

  @Query(() => [Countries], { name: 'socialInsuranceCountries' })
  async siaGetCountries(@CurrentUser() user: User) {
    return this.service.getCountries(user)
  }

  @Query(() => [EducationalInstitutions], {
    name: 'socialInsuranceEducationalInstitutions',
  })
  async siaGetEducationalInstitutions(@CurrentUser() user: User) {
    return this.service.getEducationalInstitutions(user)
  }
}
