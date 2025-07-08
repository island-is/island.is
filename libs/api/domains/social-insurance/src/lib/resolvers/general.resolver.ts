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
import { Query, Resolver, ResolveField } from '@nestjs/graphql'
import { Country } from '../models/general/country.model'
import { EducationalInstitution } from '../models/general/educationalInstitution.model'
import { Union } from '../models/general/union.model'
import { General } from '../models/general/general.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver(() => General)
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class GeneralResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => General, { name: 'socialInsuranceGeneral' })
  async getGeneral() {
    return {}
  }

  @ResolveField('unions', () => [Union], { nullable: true })
  resolveUnions(@CurrentUser() user: User) {
    return this.service.getUnions(user)
  }

  @ResolveField('countries', () => [Country], { nullable: true })
  resolveCountries(@CurrentUser() user: User) {
    return this.service.getCountries(user)
  }

  @ResolveField('educationalInstitutions', () => [EducationalInstitution], {
    nullable: true,
  })
  resolveEducationalInstitution(@CurrentUser() user: User) {
    return this.service.getEducationalInstitutions(user)
  }
}
