import { UseGuards } from '@nestjs/common'
import { Args, Query } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlagGuard,
  FeatureFlagService,
} from '@island.is/nest/feature-flags'
import { DocumentProviderDashboardService } from './document-provider-dashboard.service'
import { DocumentProviderDashboardGetStatisticsProvidersNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdProviders.input'
import { DocumentProviderDashboardProviderStatisticsPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsPaginationResponse.model'
import { DocumentProviderDashboardCategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { DocumentProviderDashboardGetStatisticsCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdCategories.input'
import { DocumentProviderDashboardGetStatisticsBreakdownByProviderId } from '../dto/document-provider-dashboard/statisticsNationalIdProvidersProviderIdBreakdown.input'
import { DocumentProviderDashboardGetStatisticsByNationalId } from '../dto/document-provider-dashboard/statisticsNationalId.input'
import { DocumentProviderDashboardStatisticsOverview } from '../models/document-provider-dashboard/statisticsOverview.model'
import { DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsBreakdownPaginationResponse.model'
import { DocumentProviderDashboardProviderStatisticsOverview } from '../models/document-provider-dashboard/providerStatisticsOverview.model'
import { DocumentProviderDashboardGetStatisticsCategoriesByProviderId } from '../dto/document-provider-dashboard/statisticsProviderId.input'
import { DocumentProviderDashboardGetStatisticsBreakdownByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdBreakdown.input'
import { DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'
import { DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByProviderId } from '../dto/document-provider-dashboard/statisticsProvidersBreakdownWithCategories.input'
import { DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdBreakdownWithCategories.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(AdminPortalScope.documentProviderInstitution)
@Audit({ namespace: '@island.is/api/document-provider-dashboard' })
export class DocumentProviderDashboardResolver {
  constructor(
    private documentProviderDashboardService: DocumentProviderDashboardService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Query(() => DocumentProviderDashboardProviderStatisticsPaginationResponse, {
    nullable: true,
    name: 'statisticProvidersByNationalId',
  })
  async statisticProvidersByNationalId(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsProvidersNationalId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticProvidersByNationalId',
          resources: user.nationalId,
          meta: {
            nationalId: user.nationalId,
          },
        },
        this.documentProviderDashboardService.getStatisticProvidersByNationalId(
          { ...input },
          user,
        ),
      )
      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }

  @Query(() => [DocumentProviderDashboardCategoryStatistics], {
    nullable: true,
    name: 'statisticsCategories',
  })
  async statisticsCategories(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsCategoriesByNationalId,
    @CurrentUser() user: User,
  ): Promise<Array<DocumentProviderDashboardCategoryStatistics> | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsCategories',
          resources: user.nationalId,
          meta: {
            nationalId: user.nationalId,
          },
        },
        this.documentProviderDashboardService.getStatisticsCategories(
          { ...input },
          user,
        ),
      )

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
      throw new GraphQLError(e.message)
    }
  }

  @Query(() => DocumentProviderDashboardStatisticsOverview, {
    nullable: true,
    name: 'statisticsByNationalId',
  })
  async statisticsByNationalId(
    @Args('input') input: DocumentProviderDashboardGetStatisticsByNationalId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardStatisticsOverview | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsByNationalId',
          resources: user.nationalId,
          meta: {
            nationalId: user.nationalId,
          },
        },
        this.documentProviderDashboardService.getStatisticsByNationalId(
          {
            ...input,
          },
          user,
        ),
      )

      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }

  @Query(
    () =>
      DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse,
    {
      nullable: true,
      name: 'statisticsBreakdownByProviderId',
    },
  )
  async statisticsBreakdownByProviderId(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsBreakdownByProviderId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownByProviderId',
          resources: input.providerId,
          meta: {
            nationalId: user.nationalId,
            providerId: input.providerId,
          },
        },
        this.documentProviderDashboardService.getStatisticsBreakdownByProviderId(
          { ...input },
          user,
        ),
      )

      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }

  @Query(() => DocumentProviderDashboardProviderStatisticsOverview, {
    nullable: true,
    name: 'statisticsOverviewByProviderId',
  })
  async statisticsOverviewByProviderId(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsCategoriesByProviderId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsOverview | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsOverviewByProviderId',
          resources: input.providerId,
          meta: {
            nationalId: user.nationalId,
            providerId: input.providerId,
          },
        },
        this.documentProviderDashboardService.getStatisticsByProviderId(
          {
            ...input,
          },
          user,
        ),
      )

      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }

  @Query(
    () =>
      DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse,
    {
      nullable: true,
      name: 'statisticsBreakdownByNationalId',
    },
  )
  async statisticsBreakdownByNationalId(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsBreakdownByNationalId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownByNationalId',
          resources: user.nationalId,
          meta: {
            nationalId: user.nationalId,
          },
        },
        this.documentProviderDashboardService.getStatisticsBreakdownByNationalId(
          { ...input },
          user,
        ),
      )

      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }

  @Query(
    () =>
      DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse,
    {
      nullable: true,
      name: 'statisticsBreakdownWithCategoriesByNationalId',
    },
  )
  async statisticsBreakdownWithCategoriesByNationalId(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownWithCategoriesByNationalId',
          resources: user.nationalId,
          meta: {
            nationalId: user.nationalId,
          },
        },
        this.documentProviderDashboardService.getStatisticsBreakdownWithCategoriesByNationalId(
          { ...input },
          user,
        ),
      )
      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }

  @Query(
    () =>
      DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse,
    {
      nullable: true,
      name: 'statisticsBreakdownWithCategoriesByProviderId',
    },
  )
  async statisticsBreakdownWithCategoriesByProviderId(
    @Args('input')
    input: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByProviderId,
    @CurrentUser() user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-provider-dashboard',
          action: 'getStatisticsBreakdownWithCategoriesByProviderId',
          resources: input.providerId,
          meta: {
            nationalId: user.nationalId,
            providerId: input.providerId,
          },
        },
        this.documentProviderDashboardService.getStatisticsBreakdownWithCategoriesByProviderId(
          { ...input },
          user,
        ),
      )

      return data
    } catch (e) {
      throw new GraphQLError(e.message)
    }
  }
}
