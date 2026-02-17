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
import { Query, Resolver, ResolveField, Args } from '@nestjs/graphql'
import { Country } from '../models/general/country.model'
import { EducationalInstitution } from '../models/general/educationalInstitution.model'
import { Union } from '../models/general/union.model'
import { General } from '../models/general/general.model'
import { SocialInsuranceService } from '../socialInsurance.service'
import type { Locale } from '@island.is/shared/types'
import { GenericKeyValueNumberObject } from '../models/general/genericKeyValueNumberObject.model'
import { GenericKeyValueStringObject } from '../models/general/genericKeyValueStringObject.model'
import {
  SocialInsuranceAdministrationGeneralService,
  SocialInsuranceAdministrationEducationService,
  SocialInsuranceAdministrationEmploymentService,
  SocialInsuranceAdministrationProfessionService,
} from '@island.is/clients/social-insurance-administration'

@Resolver(() => General)
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class GeneralResolver {
  constructor(
    private readonly service: SocialInsuranceService,
    private readonly generalService: SocialInsuranceAdministrationGeneralService,
    private readonly educationService: SocialInsuranceAdministrationEducationService,
    private readonly employmentService: SocialInsuranceAdministrationEmploymentService,
    private readonly professionService: SocialInsuranceAdministrationProfessionService,
  ) {}

  @Query(() => General, { name: 'socialInsuranceGeneral' })
  async getGeneral() {
    return {}
  }

  @ResolveField('unions', () => [Union], { nullable: true })
  resolveUnions(@CurrentUser() user: User) {
    return this.generalService.getUnions(user)
  }

  @ResolveField('countries', () => [Country], { nullable: true })
  resolveCountries(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.service.getCountries(user, locale)
  }

  @ResolveField('educationalInstitutions', () => [EducationalInstitution], {
    nullable: true,
  })
  resolveEducationalInstitution(@CurrentUser() user: User) {
    return this.educationService.getEducationalInstitutions(user)
  }

  @ResolveField('currencies', () => [String], {
    nullable: true,
  })
  resolveCurrencies(@CurrentUser() user: User) {
    return this.generalService.getCurrencies(user)
  }

  @ResolveField('languages', () => [GenericKeyValueStringObject], {
    nullable: true,
  })
  resolveLanguages(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.generalService.getLanguages(user, locale)
  }

  @ResolveField('maritalStatuses', () => [GenericKeyValueNumberObject], {
    nullable: true,
  })
  resolveMaritalStatuses(@CurrentUser() user: User) {
    return this.generalService.getMaritalStatuses(user)
  }

  @ResolveField('residenceTypes', () => [GenericKeyValueNumberObject], {
    nullable: true,
  })
  resolveResidenceTypes(@CurrentUser() user: User) {
    return this.generalService.getResidenceTypes(user)
  }

  @ResolveField('employmentStatuses', () => [GenericKeyValueStringObject], {
    nullable: true,
  })
  resolveEmploymentStatuses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.employmentService.getEmploymentStatusesWithLocale(user, locale)
  }

  @ResolveField('professions', () => [GenericKeyValueStringObject], {
    nullable: true,
  })
  resolveProfessions(@CurrentUser() user: User) {
    return this.professionService.getProfessions(user)
  }

  @ResolveField('professionActivities', () => [GenericKeyValueStringObject], {
    nullable: true,
  })
  resolveProfessionActivities(@CurrentUser() user: User) {
    return this.professionService.getProfessionActivitiesInDto(user)
  }
}
