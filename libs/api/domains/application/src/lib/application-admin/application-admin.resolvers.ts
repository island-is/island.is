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
  ApplicationApplicationsAdminInput,
  ApplicationApplicationsAdminStatisticsInput,
  ApplicationApplicationsInstitutionAdminInput,
} from './dto/applications-applications-admin-input'
import {
  ApplicationAdmin,
  ApplicationAdminPaginatedResponse,
  ApplicationDetails,
  ApplicationStatistics,
} from '../application.model'
import { ApplicationService } from '../application.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
export class ApplicationAdminResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => [ApplicationAdmin], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationsAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationApplicationsAdminInput,
  ): Promise<ApplicationAdmin[] | null> {
    return this.applicationService.findAllAdmin(user, locale, input)
  }

  @Query(() => ApplicationAdminPaginatedResponse, { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  async applicationApplicationsInstitutionAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationApplicationsInstitutionAdminInput,
  ): Promise<ApplicationAdminPaginatedResponse | null> {
    return this.applicationService.findAllInstitutionAdmin(user, locale, input)
  }

  @Query(() => [ApplicationStatistics], { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async applicationApplicationsAdminStatistics(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationApplicationsAdminStatisticsInput,
  ) {
    return this.applicationService.getApplicationCountByTypeIdAndStatus(
      user,
      locale,
      input,
    )
  }

  @Query(() => ApplicationDetails, { nullable: true })
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  async getApplicationDetails(
    @Args('applicationId') applicationId: string,
    @CurrentUser() user: User,
  ): Promise<ApplicationDetails> {
    return this.applicationService.getApplicationDetails(applicationId, user)
  }
}
