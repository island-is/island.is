import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'

import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  FeatureFlagGuard,
  FeatureFlagService,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { DocumentProviderDashboardServiceV1 } from './document-provider-dashboard.service'
import { ApiV1StatisticsNationalIdProvidersGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdProviders.input'
import { ProviderStatisticsPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsPaginationResponse.model'
import { CategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { ApiV1StatisticsNationalIdCategoriesGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdCategories.input'
import { ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdProvidersProviderIdBreakdown.input'
import { ApiV1StatisticsNationalIdGetRequest } from '../models/document-provider-dashboard/statisticsNationalId.input'
import { StatisticsOverview } from '../models/document-provider-dashboard/statisticsOverview.model'
import { ProviderStatisticsBreakdownPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsBreakdownPaginationResponse.model'
import { DocumentProviderDashboardStatisticsOverview } from '../models/document-provider-dashboard/providerStatisticsOverview.model'
import { ApiV1StatisticsNationalIdProvidersProviderIdGetRequest } from '../models/document-provider-dashboard/statisticsProviderId.input'
import { ApiV1StatisticsNationalIdBreakdownGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdBreakdown.input'
import { ProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'
import { ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest } from '../models/document-provider-dashboard/statisticsProvidersBreakdownWithCategories.input'
import { ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdBreakdownWithCategories.input'

const LOG_CATEGORY = 'document-provider-dashboard-resolver'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/document-provider-dashboard' })
export class DocumentProviderDashboardResolverV1 {
  constructor(
    private documentProviderDashboardServiceV1: DocumentProviderDashboardServiceV1,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => ProviderStatisticsPaginationResponse, {
    nullable: true,
    name: 'statisticProvidersByNationalId',
  })
  async statisticProvidersByNationalId(
    @Args('input') input: ApiV1StatisticsNationalIdProvidersGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsPaginationResponse | null> {
    console.log('input in resolver', input)
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticProvidersByNationalId',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticProvidersByNationalId(
          { ...input },
        ),
      )

      return data
    } catch (e) {
      this.logger.warn('Failed to get statistic Providers By National Id', {
        category: LOG_CATEGORY,
        nationalId: input.nationalId,
        error: e,
      })
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  //@ResolveField('data', () => [CategoryStatistics])
  @Query(() => [CategoryStatistics], {
    nullable: true,
    name: 'statisticsCategories',
  })
  async statisticsCategories(
    @Args('input') input: ApiV1StatisticsNationalIdCategoriesGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Array<CategoryStatistics> | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsCategories',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsCategories({
          ...input
        }),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn('Failed to getStatisticsCategories', {
        category: LOG_CATEGORY,
        nationalId: input.nationalId,
        error: e,
      })
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => StatisticsOverview, {
    nullable: true,
    name: 'statisticsByNationalId',
  })
  async statisticsByNationalId(
    @Args('input') input: ApiV1StatisticsNationalIdGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<StatisticsOverview | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsByNationalId',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsByNationalId({
          ...input,
        }),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn('Failed to getStatisticsByNationalId', {
        category: LOG_CATEGORY,
        nationalId: input.nationalId,
        error: e,
      })
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => ProviderStatisticsBreakdownPaginationResponse, {
    nullable: true,
    name: 'statisticsBreakdownByProvidersId',
  })
  async statisticsBreakdownByProvidersId(
    @Args('input')
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownByProvidersId',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsBreakdownByProvidersId(
          { ...input },
        ),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn('Failed to getStatisticsBreakdownByProvidersId', {
        category: LOG_CATEGORY,
        nationalId: input.nationalId,
        error: e,
      })
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => DocumentProviderDashboardStatisticsOverview, {
    nullable: true,
    name: 'statisticsOverviewByProviderId',
  })
  async statisticsOverviewByProviderId(
    @Args('input')
    input: ApiV1StatisticsNationalIdProvidersProviderIdGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardStatisticsOverview | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsOverviewByProviderId',
          resources: input.providerId,
          meta: {
            nationalId: input.nationalId,
            providerId: input.providerId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsByProviderId({
          ...input,
        }),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn('Failed to getStatisticsOverviewByProviderId', {
        category: LOG_CATEGORY,
        nationalId: input.nationalId,
        providerId: input.providerId,
        error: e,
      })
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => ProviderStatisticsBreakdownPaginationResponse, {
    nullable: true,
    name: 'statisticsBreakdownByNationalId',
  })
  async statisticsBreakdownByNationalId(
    @Args('input') input: ApiV1StatisticsNationalIdBreakdownGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownByNationalId',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsBreakdownByNationalId(
          { ...input },
        ),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn('Failed to getStatisticsBreakdownByNationalId', {
        category: LOG_CATEGORY,
        nationalId: input.nationalId,
        error: e,
      })
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => ProviderStatisticsCategoryBreakdownPaginationResponse, {
    nullable: true,
    name: 'statisticsBreakdownWithCategoriesByNationalId',
  })
  async statisticsBreakdownWithCategoriesByNationalId(
    @Args('input')
    input: ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownWithCategoriesByNationalId',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsBreakdownWithCategoriesByNationalId(
          { ...input },
        ),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn(
        'Failed to getStatisticsBreakdownWithCategoriesByNationalId',
        {
          category: LOG_CATEGORY,
          nationalId: input.nationalId,
          error: e,
        },
      )
      throw e
    }
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => ProviderStatisticsCategoryBreakdownPaginationResponse, {
    nullable: true,
    name: 'statisticsBreakdownWithCategoriesByProviderId',
  })
  async statisticsBreakdownWithCategoriesByProviderId(
    @Args('input')
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownWithCategoriesByProviderId',
          resources: input.providerId,
          meta: {
            nationalId: input.nationalId,
            providerId: input.providerId,
          },
        },
        this.documentProviderDashboardServiceV1.getStatisticsBreakdownWithCategoriesByProviderId(
          { ...input },
        ),
      )

      // Ensure categoryId is always a number and not undefined
      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn(
        'Failed to getStatisticsBreakdownWithCategoriesByProviderId',
        {
          category: LOG_CATEGORY,
          nationalId: input.nationalId,
          error: e,
        },
      )
      throw e
    }
  }
}
