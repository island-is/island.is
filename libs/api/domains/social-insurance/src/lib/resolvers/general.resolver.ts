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
import { MaritalStatus } from '../models/general/maritalStatus.model'
import { HousingType } from '../models/general/housingType.model'
import { EmploymentStatus } from '../models/general/employmentStatus.model'
import { Profession } from '../models/general/profession.model'
import { ProfessionActivity } from '../models/general/professionActivity.model'
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

  @ResolveField('currencies', () => [String], {
    nullable: true,
  })
  resolveCurrencies(@CurrentUser() user: User) {
    return this.service.getCurrencies(user)
  }

  @ResolveField('maritalStatuses', () => [MaritalStatus], { nullable: true })
  resolveMaritalStatuses(@CurrentUser() user: User) {
    return this.service.getMaritalStatuses(user)
  }

  @ResolveField('housingTypes', () => [HousingType], { nullable: true })
  resolveHousingTypes(@CurrentUser() user: User) {
    return this.service.getHousingTypes(user)
  }

  @ResolveField('employmentStatuses', () => [EmploymentStatus], {
    nullable: true,
  })
  resolveEmploymentStatuses(@CurrentUser() user: User) {
    return this.service.getEmploymentStatuses(user)
  }

  @ResolveField('professions', () => [Profession], { nullable: true })
  resolveProfessions(@CurrentUser() user: User) {
    return this.service.getProfessions(user)
  }

  @ResolveField('professionActivities', () => [ProfessionActivity], {
    nullable: true,
  })
  resolveProfessionActivities(@CurrentUser() user: User) {
    return this.service.getProfessionActivities(user)
  }
}
