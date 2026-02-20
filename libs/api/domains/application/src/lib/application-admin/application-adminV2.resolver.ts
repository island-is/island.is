import { Args, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import type { Locale } from '@island.is/shared/types'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Scopes } from '@island.is/auth-nest-tools'
import {
  ApplicationsAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationsSuperAdminFilters,
  ApplicationTypesAdminInput,
} from './dto/applications-admin-inputs'
import {
  ApplicationAdmin,
  ApplicationAdminPaginatedResponse,
  ApplicationInstitution,
  ApplicationStatistics,
  ApplicationTypeAdminInstitution,
} from '../application.model'
import { ApplicationV2Service } from '../applicationV2.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
export class ApplicationAdminV2Resolver {
  constructor(private applicationService: ApplicationV2Service) {}

  @Query(() => ApplicationAdminPaginatedResponse, { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationV2ApplicationsSuperAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsSuperAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse | null> {
    return this.applicationService.findAllApplicationsForSuperAdmin(
      user,
      locale,
      input,
    )
  }

  @Query(() => ApplicationAdminPaginatedResponse, { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationV2ApplicationsInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse | null> {
    return this.applicationService.findAllApplicationsForInstitutionAdmin(
      user,
      locale,
      input,
    )
  }

  @Query(() => [ApplicationTypeAdminInstitution], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationV2ApplicationTypesSuperAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: ApplicationTypesAdminInput,
  ): Promise<ApplicationTypeAdminInstitution[] | null> {
    return this.applicationService.findAllApplicationTypesForSuperAdmin(
      user,
      locale,
      input,
    )
  }

  @Query(() => [ApplicationTypeAdminInstitution], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationV2ApplicationTypesInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<ApplicationTypeAdminInstitution[] | null> {
    return this.applicationService.findAllApplicationTypesForInstitutionAdmin(
      user,
      locale,
    )
  }

  @Query(() => [ApplicationInstitution], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationV2InstitutionsSuperAdmin(@CurrentUser() user: User) {
    return this.applicationService.findAllInstitutionsForSuperAdmin(user)
  }

  @Query(() => [ApplicationStatistics], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationV2ApplicationStatisticsSuperAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationService.getApplicationStatisticsForSuperAdmin(
      user,
      locale,
      input,
    )
  }

  @Query(() => [ApplicationStatistics], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationV2ApplicationStatisticsInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationService.getApplicationStatisticsForInstitutionAdmin(
      user,
      locale,
      input,
    )
  }
}
