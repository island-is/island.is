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
import { ApplicationsSuperAdminFilters } from './dto/applications-admin-inputs'
import {
  ApplicationAdmin,
  ApplicationAdminPaginatedResponse,
} from '../application.model'
import { ApplicationV2Service } from '../applicationV2.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
export class ApplicationAdminV2Resolver {
  constructor(private applicationService: ApplicationV2Service) {}

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

  // TODOxy add rest of endpoints that are in V1 resolver
}
