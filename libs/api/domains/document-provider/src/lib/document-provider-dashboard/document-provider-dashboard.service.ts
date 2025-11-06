import {
  StatisticsApi,
  TotalStatisticsSortBy,
  CategoryStatisticsSortBy,
  StatisticsSortBy,
} from '@island.is/clients/document-provider-dashboard'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { DocumentProviderDashboardGetStatisticsProvidersNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdProviders.input'
import { DocumentProviderDashboardProviderStatisticsPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsPaginationResponse.model'
import { DocumentProviderDashboardStatisticsSortBy } from '../dto/document-provider-dashboard/statisticsNationalIdProviders.input'
import { DocumentProviderDashboardCategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { DocumentProviderDashboardGetStatisticsByNationalId } from '../dto/document-provider-dashboard/statisticsNationalId.input'
import { DocumentProviderDashboardStatisticsOverview } from '../models/document-provider-dashboard/statisticsOverview.model'
import { DocumentProviderDashboardGetStatisticsBreakdownByProviderId } from '../dto/document-provider-dashboard/statisticsNationalIdProvidersProviderIdBreakdown.input'
import { DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsBreakdownPaginationResponse.model'
import { DocumentProviderDashboardGetStatisticsCategoriesByProviderId } from '../dto/document-provider-dashboard/statisticsProviderId.input'
import { DocumentProviderDashboardProviderStatisticsOverview } from '../models/document-provider-dashboard/providerStatisticsOverview.model'
import {
  DocumentProviderDashboardGetStatisticsBreakdownByNationalId,
  DocumentProviderDashboardTotalStatisticsSortBy,
} from '../dto/document-provider-dashboard/statisticsNationalIdBreakdown.input'
import { DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdBreakdownWithCategories.input'
import { DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'
import {
  DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByProviderId,
  DocumentProviderDashboardCategoryStatisticsSortBy,
} from '../dto/document-provider-dashboard/statisticsProvidersBreakdownWithCategories.input'
import {
  mapBreakdownItems,
  mapCategoryStatisticsItems,
  mapStatistics,
} from '../utils/mappers'
import { DocumentProviderDashboardGetStatisticsCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdCategories.input'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class DocumentProviderDashboardService {
  constructor(
    private statisticsApi: StatisticsApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStatisticProvidersByNationalId(
    input: DocumentProviderDashboardGetStatisticsProvidersNationalId,
    user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsPaginationResponse | null> {
    const statisticProviders =
      await this.statisticsApi.apiV1StatisticsNationalIdProvidersGet({
        ...input,
        nationalId: user.nationalId,
        sortBy: input.sortBy as StatisticsSortBy | undefined,
      })

    if (!statisticProviders) {
      return null
    }

    return {
      totalCount: statisticProviders.totalCount ?? 0,
      items: (statisticProviders.items ?? [])
        .filter(
          (item) =>
            item.providerId !== undefined &&
            item.name != null &&
            item.statistics !== undefined,
        )
        .map((item) => ({
          providerId: item.providerId as string,
          name: item.name as string,
          statistics: item.statistics
            ? mapStatistics(item.statistics)
            : undefined,
        })),
    }
  }

  async getStatisticsCategories(
    input: DocumentProviderDashboardGetStatisticsCategoriesByNationalId,
    user: User,
  ): Promise<Array<DocumentProviderDashboardCategoryStatistics> | null> {
    const statisticCategories =
      await this.statisticsApi.apiV1StatisticsNationalIdCategoriesGet({
        ...input,
        nationalId: user.nationalId,
      })

    if (!statisticCategories) {
      return null
    }

    return (
      statisticCategories as Array<DocumentProviderDashboardCategoryStatistics>
    )
      .filter((category) => category.name !== null)
      .map((category) => ({
        ...category,
        name: category.name as string,
      }))
  }

  async getStatisticsByNationalId(
    input: DocumentProviderDashboardGetStatisticsByNationalId,
    user: User,
  ): Promise<DocumentProviderDashboardStatisticsOverview | null> {
    const statistics = await this.statisticsApi.apiV1StatisticsNationalIdGet({
      ...input,
      nationalId: user.nationalId,
    })

    if (!statistics) {
      return null
    }

    return {
      ...statistics,
      statistics: statistics.statistics
        ? mapStatistics(statistics.statistics)
        : undefined,
    }
  }

  async getStatisticsBreakdownByProviderId(
    input: DocumentProviderDashboardGetStatisticsBreakdownByProviderId,
    user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse | null> {
    const breakdown =
      await this.statisticsApi.apiV1StatisticsNationalIdProvidersProviderIdBreakdownGet(
        {
          ...input,
          nationalId: user.nationalId,
          sortBy: input.sortBy as TotalStatisticsSortBy | undefined,
        },
      )

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: mapBreakdownItems(breakdown.items ?? undefined),
    }
  }

  async getStatisticsByProviderId(
    input: DocumentProviderDashboardGetStatisticsCategoriesByProviderId,
    user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsOverview | null> {
    const statistic =
      await this.statisticsApi.apiV1StatisticsNationalIdProvidersProviderIdGet({
        ...input,
        nationalId: user.nationalId,
      })

    if (!statistic) {
      return null
    }

    return {
      name: statistic.providerName ?? '',
      statistics: mapStatistics(statistic.statistics),
    }
  }

  async getStatisticsBreakdownByNationalId(
    input: DocumentProviderDashboardGetStatisticsBreakdownByNationalId,
    user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse | null> {
    const breakdown =
      await this.statisticsApi.apiV1StatisticsNationalIdBreakdownGet({
        ...input,
        nationalId: user.nationalId,
        sortBy: input.sortBy as CategoryStatisticsSortBy | undefined,
      })

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: mapBreakdownItems(breakdown.items ?? undefined),
    }
  }

  async getStatisticsBreakdownWithCategoriesByNationalId(
    input: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId,
    user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const breakdown =
      await this.statisticsApi.apiV1StatisticsNationalIdBreakdownCategoriesGet({
        ...input,
        nationalId: user.nationalId,
        sortBy: input.sortBy as CategoryStatisticsSortBy | undefined,
      })

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: mapCategoryStatisticsItems(breakdown.items ?? undefined),
    }
  }

  async getStatisticsBreakdownWithCategoriesByProviderId(
    input: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByProviderId,
    user: User,
  ): Promise<DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const breakdown =
      await this.statisticsApi.apiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGet(
        {
          ...input,
          nationalId: user.nationalId,
          sortBy: input.sortBy as CategoryStatisticsSortBy | undefined,
        },
      )

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: mapCategoryStatisticsItems(breakdown.items ?? undefined),
    }
  }
}
