import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import type { Locale } from '@island.is/shared/types'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Scopes } from '@island.is/auth-nest-tools'
import { ApplicationApplicationsAdminInput } from './dto/applications-applications-admin-input'
import { ApplicationAdmin } from '../application.model'
import { ApplicationService } from '../application.service'
import {
  Logger,
  logger as islandis_logger,
  LOGGER_PROVIDER,
} from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
@Scopes(AdminPortalScope.applicationSystem)
export class ApplicationAdminResolver {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private applicationService: ApplicationService,
  ) {}

  @Query(() => [ApplicationAdmin], { nullable: true })
  async applicationApplicationsAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationApplicationsAdminInput,
  ): Promise<ApplicationAdmin[] | null> {
    this.logger.debug('applicationApplicationsAdmin in the admin resolver')
    return this.applicationService.findAllAdmin(user, locale, input)
  }
}
