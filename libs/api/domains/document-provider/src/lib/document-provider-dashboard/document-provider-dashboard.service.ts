import { StatisticsApi } from '@island.is/clients/document-provider-dashboard'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { GetStatisticsProvidersNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdProviders.input'
import { ProviderStatisticsPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsPaginationResponse.model'
import { StatisticsSortBy } from '../dto/document-provider-dashboard/statisticsNationalIdProviders.input'
import { CategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { GetStatisticsByNationalId } from '../dto/document-provider-dashboard/statisticsNationalId.input'
import { StatisticsOverview } from '../models/document-provider-dashboard/statisticsOverview.model'
import { GetStatisticsBreakdownByProviderId } from '../dto/document-provider-dashboard/statisticsNationalIdProvidersProviderIdBreakdown.input'
import { ProviderStatisticsBreakdownPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsBreakdownPaginationResponse.model'
import { GetStatisticsCategoriesByProviderId } from '../dto/document-provider-dashboard/statisticsProviderId.input'
import { DocumentProviderDashboardStatisticsOverview } from '../models/document-provider-dashboard/providerStatisticsOverview.model'
import {
  GetStatisticsBreakdownByNationalId,
  TotalStatisticsSortBy,
} from '../dto/document-provider-dashboard/statisticsNationalIdBreakdown.input'
import { GetStatisticsBreakdownWithCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdBreakdownWithCategories.input'
import { ProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'
import {
  GetStatisticsBreakdownWithCategoriesByProviderId,
  CategoryStatisticsSortBy,
} from '../dto/document-provider-dashboard/statisticsProvidersBreakdownWithCategories.input'
import {
  mapBreakdownItems,
  mapCategoryStatisticsItems,
  mapStatistics,
} from '../utils/mappers'
import { GetStatisticsCategoriesByNationalId } from '../dto/document-provider-dashboard/statisticsNationalIdCategories.input'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class DocumentProviderDashboardService {
  constructor(
    private statisticsApi: StatisticsApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStatisticProvidersByNationalId(
    input: GetStatisticsProvidersNationalId,
    user: User,
  ): Promise<ProviderStatisticsPaginationResponse | null> {
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
    input: GetStatisticsCategoriesByNationalId,
    user: User,
  ): Promise<Array<CategoryStatistics> | null> {
    const statisticCategories =
      await this.statisticsApi.apiV1StatisticsNationalIdCategoriesGet({
        ...input,
        nationalId: user.nationalId,
      })

    if (!statisticCategories) {
      return null
    }

    return (statisticCategories as Array<CategoryStatistics>)
      .filter((category) => category.name !== null)
      .map((category) => ({
        ...category,
        name: category.name as string,
      }))
  }

  async getStatisticsByNationalId(
    input: GetStatisticsByNationalId,
    user: User,
  ): Promise<StatisticsOverview | null> {
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
    input: GetStatisticsBreakdownByProviderId,
    user: User,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
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
    input: GetStatisticsCategoriesByProviderId,
    user: User,
  ): Promise<DocumentProviderDashboardStatisticsOverview | null> {
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
    input: GetStatisticsBreakdownByNationalId,
    user: User,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
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
    input: GetStatisticsBreakdownWithCategoriesByNationalId,
    user: User,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
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
    input: GetStatisticsBreakdownWithCategoriesByProviderId,
    user: User,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
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
