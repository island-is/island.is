import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query } from '@nestjs/graphql'
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
import { DocumentProviderDashboardService } from './document-provider-dashboard.service'
import { GetStatisticsProvidersNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdProviders.input'
import { ProviderStatisticsPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsPaginationResponse.model'
import { CategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { GetStatisticsCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdCategories.input'
import { GetStatisticsBreakdownByProviderId } from '../dto/document-provider-dashboard/statisticsNationalIdProvidersProviderIdBreakdown.input'
import { GetStatisticsByNationalId } from '../dto/document-provider-dashboard/statisticsNationalId.input'
import { StatisticsOverview } from '../models/document-provider-dashboard/statisticsOverview.model'
import { ProviderStatisticsBreakdownPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsBreakdownPaginationResponse.model'
import { DocumentProviderDashboardStatisticsOverview } from '../models/document-provider-dashboard/providerStatisticsOverview.model'
import { GetStatisticsCategoriesByProviderId } from '../dto/document-provider-dashboard/statisticsProviderId.input'
import { GetStatisticsBreakdownByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdBreakdown.input'
import { ProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'
import { GetStatisticsBreakdownWithCategoriesByProviderId } from '../dto/document-provider-dashboard/statisticsProvidersBreakdownWithCategories.input'
import { GetStatisticsBreakdownWithCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdBreakdownWithCategories.input'

const LOG_CATEGORY = 'document-provider-dashboard-resolver'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/document-provider-dashboard' })
export class DocumentProviderDashboardResolver {
  constructor(
    private documentProviderDashboardService: DocumentProviderDashboardService,
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
    @Args('input') input: GetStatisticsProvidersNationalId,
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsPaginationResponse | null> {
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
        this.documentProviderDashboardService.getStatisticProvidersByNationalId(
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
  @Query(() => [CategoryStatistics], {
    nullable: true,
    name: 'statisticsCategories',
  })
  async statisticsCategories(
    @Args('input') input: GetStatisticsCategoriesByNationalId,
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
        this.documentProviderDashboardService.getStatisticsCategories({
          ...input,
        }),
      )

      if (!data) {
        return null
      }

      // Ensure categoryId is always a number and not undefined
      return Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            categoryId:
              item.categoryId !== undefined
                ? Number(item.categoryId)
                : undefined,
          }))
        : data
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
    @Args('input') input: GetStatisticsByNationalId,
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
        this.documentProviderDashboardService.getStatisticsByNationalId({
          ...input,
        }),
      )
      // Check if data is null or undefined
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
    name: 'statisticsBreakdownByProviderId',
  })
  async statisticsBreakdownByProviderId(
    @Args('input')
    input: GetStatisticsBreakdownByProviderId,
    @CurrentUser() user: User,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownByProviderId',
          resources: input.nationalId,
          meta: {
            nationalId: input.nationalId,
          },
        },
        this.documentProviderDashboardService.getStatisticsBreakdownByProviderId(
          { ...input },
        ),
      )

      if (!data) {
        return null
      }

      return data
    } catch (e) {
      this.logger.warn('Failed to getStatisticsBreakdownByProviderId', {
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
    input: GetStatisticsCategoriesByProviderId,
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
        this.documentProviderDashboardService.getStatisticsByProviderId({
          ...input,
        }),
      )

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
    @Args('input') input: GetStatisticsBreakdownByNationalId,
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
        this.documentProviderDashboardService.getStatisticsBreakdownByNationalId(
          { ...input },
        ),
      )

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
    input: GetStatisticsBreakdownWithCategoriesByNationalId,
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
        this.documentProviderDashboardService.getStatisticsBreakdownWithCategoriesByNationalId(
          { ...input },
        ),
      )

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
    input: GetStatisticsBreakdownWithCategoriesByProviderId,
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
        this.documentProviderDashboardService.getStatisticsBreakdownWithCategoriesByProviderId(
          { ...input },
        ),
      )

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
