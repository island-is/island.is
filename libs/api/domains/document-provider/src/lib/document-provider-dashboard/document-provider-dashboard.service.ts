import {
  ApiV1StatisticsNationalIdCategoriesGetRequest,
  DocumentProviderDashboardClientService,
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
import {
  mapBreakdownItems,
  mapCategoryStatisticsItems,
  mapStatistics,
} from '../utils/mappers'

@Injectable()
export class DocumentProviderDashboardService {
  constructor(
    private documentDashboardClientService: DocumentProviderDashboardClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStatisticProvidersByNationalId(
    input: ApiV1StatisticsNationalIdProvidersGetRequest,
  ): Promise<ProviderStatisticsPaginationResponse | null> {
    const statisticProviders =
      await this.documentDashboardClientService.getStatisticProvidersByNationalId(
        {
          ...input,
          sortBy: input.sortBy as StatisticsSortBy | undefined,
        },
      )

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
    input: ApiV1StatisticsNationalIdCategoriesGetRequest,
  ): Promise<Array<CategoryStatistics> | null> {
    const statisticCategories =
      await this.documentDashboardClientService.getStatisticsCategories({
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
    const statistics =
      await this.documentDashboardClientService.getStatisticsByNationalId({
        ...input,
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
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardClientService.getStatisticsBreakdownByProviderId(
        {
          ...input,
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
    input: ApiV1StatisticsNationalIdProvidersProviderIdGetRequest,
  ): Promise<DocumentProviderDashboardStatisticsOverview | null> {
    const statistic =
      await this.documentDashboardClientService.getStatisticsByProviderId({
        ...input,
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
    input: ApiV1StatisticsNationalIdBreakdownGetRequest,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardClientService.getStatisticsBreakdownByNationalId(
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
      items: mapBreakdownItems(breakdown.items ?? undefined),
    }
  }

  async getStatisticsBreakdownWithCategoriesByNationalId(
    input: ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardClientService.getStatisticsBreakdownWithCategoriesByNationalId(
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
      items: mapCategoryStatisticsItems(breakdown.items ?? undefined),
    }
  }

  async getStatisticsBreakdownWithCategoriesByProviderId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const breakdown =
      await this.documentDashboardClientService.getStatisticsBreakdownWithCategoriesByProviderId(
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
      items: mapCategoryStatisticsItems(breakdown.items ?? undefined),
    }
  }
}
