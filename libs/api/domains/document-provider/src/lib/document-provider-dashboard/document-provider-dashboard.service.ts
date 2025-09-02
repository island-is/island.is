import {
  ApiV1StatisticsNationalIdCategoriesGetRequest,
  DocumentProviderDashboardService,
} from '@island.is/clients/document-provider-dashboard'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApiV1StatisticsNationalIdProvidersGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdProviders.input'
import { ProviderStatisticsPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsPaginationResponse.model'
import { StatisticsSortBy } from '../models/document-provider-dashboard/statisticsNationalIdProviders.input'
import { CategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { ApiV1StatisticsNationalIdGetRequest } from '../models/document-provider-dashboard/statisticsNationalId.input'
import { StatisticsOverview } from '../models/document-provider-dashboard/statisticsOverview.model'
import { ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdProvidersProviderIdBreakdown.input'
import { ProviderStatisticsBreakdownPaginationResponse } from '../models/document-provider-dashboard/providerStatisticsBreakdownPaginationResponse.model'
import { ApiV1StatisticsNationalIdProvidersProviderIdGetRequest } from '../models/document-provider-dashboard/statisticsProviderId.input'
import { DocumentProviderDashboardStatisticsOverview } from '../models/document-provider-dashboard/providerStatisticsOverview.model'
import {
  ApiV1StatisticsNationalIdBreakdownGetRequest,
  TotalStatisticsSortBy,
} from '../models/document-provider-dashboard/statisticsNationalIdBreakdown.input'
import { ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest } from '../models/document-provider-dashboard/statisticsNationalIdBreakdownWithCategories.input'
import { ProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'
import {
  ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest,
  CategoryStatisticsSortBy,
} from '../models/document-provider-dashboard/statisticsProvidersBreakdownWithCategories.input'

@Injectable()
export class DocumentProviderDashboardServiceV1 {
  constructor(
    private documentDashboardService: DocumentProviderDashboardService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStatisticProvidersByNationalId(
    input: ApiV1StatisticsNationalIdProvidersGetRequest,
  ): Promise<ProviderStatisticsPaginationResponse | null> {
    console.log('input in service', input)
    const statisticProviders =
      await this.documentDashboardService.getStatisticProvidersByNationalId({
        ...input,
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
            ? {
                published: item.statistics.published ?? 0,
                notifications: item.statistics.notifications ?? 0,
                opened: item.statistics.opened ?? 0,
                failures: item.statistics.failures ?? 0,
              }
            : undefined,
        })),
    }
  }

  async getStatisticsCategories(
    input: ApiV1StatisticsNationalIdCategoriesGetRequest,
  ): Promise<Array<CategoryStatistics> | null> {
    const statisticCategories =
      await this.documentDashboardService.getStatisticsCategories({
        ...input,
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
    input: ApiV1StatisticsNationalIdGetRequest,
  ): Promise<StatisticsOverview | null> {
    const statisticCategories =
      await this.documentDashboardService.getStatisticsByNationalId({
        ...input,
      })

    if (!statisticCategories) {
      return null
    }

    return {
      ...statisticCategories,
      statistics: statisticCategories.statistics
        ? {
            published: statisticCategories.statistics.published ?? 0,
            notifications: statisticCategories.statistics.notifications ?? 0,
            opened: statisticCategories.statistics.opened ?? 0,
            failures: statisticCategories.statistics.failures ?? 0,
          }
        : undefined,
    }
  }

  async getStatisticsBreakdownByProvidersId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardService.getStatisticsBreakdownByProvidersId({
        ...input,
        sortBy: input.sortBy as TotalStatisticsSortBy | undefined,
      })

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: (breakdown.items ?? []).map((item) => ({
        year: item.year ?? 0,
        month: item.month ?? 0,
        statistics: item.statistics
          ? {
              published: item.statistics.published ?? 0,
              notifications: item.statistics.notifications ?? 0,
              opened: item.statistics.opened ?? 0,
              failures: item.statistics.failures ?? 0,
            }
          : {
              published: 0,
              notifications: 0,
              opened: 0,
              failures: 0,
            },
      })),
    }
  }

  async getStatisticsByProviderId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdGetRequest,
  ): Promise<DocumentProviderDashboardStatisticsOverview | null> {
    const statistic =
      await this.documentDashboardService.getStatisticsByProviderId({
        ...input,
      })

    if (!statistic) {
      return null
    }

    return {
      name: statistic.providerName ?? '',
      statistics: statistic.statistics
        ? {
            published: statistic.statistics.published ?? 0,
            notifications: statistic.statistics.notifications ?? 0,
            opened: statistic.statistics.opened ?? 0,
            failures: statistic.statistics.failures ?? 0,
          }
        : {
            published: 0,
            notifications: 0,
            opened: 0,
            failures: 0,
          },
    }
  }

  async getStatisticsBreakdownByNationalId(
    input: ApiV1StatisticsNationalIdBreakdownGetRequest,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardService.getStatisticsBreakdownByNationalId({
        ...input,
        sortBy: input.sortBy as CategoryStatisticsSortBy | undefined,
      })

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: (breakdown.items ?? []).map((item) => ({
        year: item.year ?? 0,
        month: item.month ?? 0,
        statistics: item.statistics
          ? {
              published: item.statistics.published ?? 0,
              notifications: item.statistics.notifications ?? 0,
              opened: item.statistics.opened ?? 0,
              failures: item.statistics.failures ?? 0,
            }
          : {
              published: 0,
              notifications: 0,
              opened: 0,
              failures: 0,
            },
      })),
    }
  }

  async getStatisticsBreakdownWithCategoriesByNationalId(
    input: ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardService.getStatisticsBreakdownWithCategoriesByNationalId(
        {
          ...input,
          sortBy: input.sortBy as CategoryStatisticsSortBy | undefined,
        },
      )

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: (breakdown.items ?? []).map((item) => ({
        year: item.year,
        month: item.month,
        categoryStatistics: item.categoryStatistics
          ? (item.categoryStatistics as Array<CategoryStatistics>).map(
              (category) => ({
                name: category.name ?? '',
                published: category.published ?? 0,
              }),
            )
          : [],
      })),
    }
  }

  async getStatisticsBreakdownWithCategoriesByProviderId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardService.getStatisticsBreakdownWithCategoriesByProviderId(
        {
          ...input,
          sortBy: input.sortBy as CategoryStatisticsSortBy | undefined,
        },
      )

    if (!breakdown) {
      return null
    }

    return {
      ...breakdown,
      totalCount: breakdown.totalCount ?? 0,
      items: (breakdown.items ?? []).map((item) => ({
        year: item.year,
        month: item.month,
        categoryStatistics: item.categoryStatistics
          ? (item.categoryStatistics as Array<CategoryStatistics>).map(
              (category) => ({
                name: category.name ?? '',
                published: category.published ?? 0,
              }),
            )
          : [],
      })),
    }
  }
}
