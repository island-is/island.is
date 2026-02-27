import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
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
  ApplicationTypesAdminInput,
} from './dto/applications-admin-inputs'
import {
  ApplicationAdmin,
  ApplicationAdminPaginatedResponse,
  ApplicationStatistics,
  ApplicationTypeAdminInstitution,
  ApplicationInstitution,
} from '../application.model'
import { ApplicationAdminService } from './application-admin.service'

@Directive(
  '@deprecated(reason: "Use ApplicationV2Resolver which merges results from both application-system and form-system")',
)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
export class ApplicationAdminResolver {
  constructor(private applicationService: ApplicationAdminService) {}

  @Query(() => ApplicationAdminPaginatedResponse, {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationsSuperAdmin(
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

  @Query(() => ApplicationAdminPaginatedResponse, {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationApplicationsInstitutionAdmin(
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

  @Query(() => [ApplicationTypeAdminInstitution], {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationApplicationTypesInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<ApplicationTypeAdminInstitution[] | null> {
    return this.applicationService.findAllApplicationTypesForInstitutionAdmin(
      user,
      locale,
    )
  }

  @Query(() => [ApplicationTypeAdminInstitution], {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationTypesSuperAdmin(
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

  @Query(() => [ApplicationInstitution], {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationInstitutionsSuperAdmin(@CurrentUser() user: User) {
    return this.applicationService.findAllInstitutionsForSuperAdmin(user)
  }

  @Query(() => [ApplicationStatistics], {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationStatisticsSuperAdmin(
    @CurrentUser() user: User,
    @Args('input')
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationService.getApplicationStatisticsForSuperAdmin(
      user,
      input,
    )
  }

  @Query(() => [ApplicationStatistics], {
    nullable: true,
    deprecationReason:
      'Use ApplicationV2Resolver which merges results from both application-system and form-system',
  })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationApplicationStatisticsInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('input')
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationService.getApplicationStatisticsForInstitutionAdmin(
      user,
      input,
    )
  }
}
