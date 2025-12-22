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
  ApplicationsSuperAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationTypesInstitutionAdminInput,
} from './dto/applications-admin-inputs'
import {
  ApplicationAdmin,
  ApplicationAdminPaginatedResponse,
  ApplicationStatistics,
  ApplicationTypeAdminInstitution,
  ApplicationInstitution,
} from '../application.model'
import { ApplicationService } from '../application.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
export class ApplicationAdminResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => ApplicationAdminPaginatedResponse, { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationsAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsSuperAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse | null> {
    return this.applicationService.findAllSuperAdmin(user, locale, input)
  }

  @Query(() => ApplicationAdminPaginatedResponse, { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationApplicationsInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse | null> {
    return this.applicationService.findAllInstitutionAdmin(user, locale, input)
  }

  @Query(() => [ApplicationTypeAdminInstitution], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationTypesInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: ApplicationTypesInstitutionAdminInput,
  ): Promise<ApplicationTypeAdminInstitution[] | null> {
    return this.applicationService.findAllApplicationTypesInstitutionAdmin(
      user,
      locale,
      input,
    )
  }

  @Query(() => [ApplicationTypeAdminInstitution], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationTypesSuperAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<ApplicationTypeAdminInstitution[] | null> {
    return this.applicationService.findAllApplicationTypesSuperAdmin(
      user,
      locale,
    )
  }

  @Query(() => [ApplicationStatistics], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationsAdminStatistics(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationService.getApplicationCountByTypeIdAndStatus(
      user,
      locale,
      input,
    )
  }

  @Query(() => [ApplicationInstitution], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationsAdminInstitutions(@CurrentUser() user: User) {
    return this.applicationService.getApplicationInstitutions(user)
  }
}
