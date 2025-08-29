import {
  ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest,
  ApiV1StatisticsNationalIdBreakdownGetRequest,
  ApiV1StatisticsNationalIdCategoriesGetRequest,
  ApiV1StatisticsNationalIdGetRequest,
  ApiV1StatisticsNationalIdProvidersGetRequest,
  ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest,
  ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest,
  ApiV1StatisticsNationalIdProvidersProviderIdGetRequest,
  CategoryStatistics,
  ProviderStatistics,
  ProviderStatisticsBreakdownPaginationResponse,
  ProviderStatisticsCategoryBreakdownPaginationResponse,
  ProviderStatisticsOverview,
  ProviderStatisticsPaginationResponse,
  StatisticsApi,
  StatisticsOverview,
} from '../../gen/fetch'
import { Injectable, Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER } from '@island.is/logging'

const LOG_CATEGORY = 'clients-document-provider-dashboard-v1'

@Injectable()
export class DocumentProviderDashboardService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private api: StatisticsApi,
  ) {}

  async getStatisticProvidersByNationalId(
    input: ApiV1StatisticsNationalIdProvidersGetRequest,
  ): Promise<ProviderStatisticsPaginationResponse | null> {
    const statistics = await this.api.apiV1StatisticsNationalIdProvidersGet(
      input,
    )

    if (!statistics.totalCount) {
      return null
    }

    return statistics
  }

  async getStatisticsCategories(
    input: ApiV1StatisticsNationalIdCategoriesGetRequest,
  ): Promise<Array<CategoryStatistics> | null> {
    return await this.api.apiV1StatisticsNationalIdCategoriesGet(input)
  }

  async getStatisticsByNationalId(
    input: ApiV1StatisticsNationalIdGetRequest,
  ): Promise<StatisticsOverview | null> {
    return await this.api.apiV1StatisticsNationalIdGet(input)
  }

  async getStatisticsBreakdownByProvidersId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    const statistics =
      await this.api.apiV1StatisticsNationalIdProvidersProviderIdBreakdownGet(
        input,
      )

    if (!statistics.totalCount) {
      return null
    }

    return statistics
  }

  async getStatisticsByProviderId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdGetRequest,
  ): Promise<ProviderStatisticsOverview | null> {
    return await this.api.apiV1StatisticsNationalIdProvidersProviderIdGet(input)
  }

  async getStatisticsBreakdownByNationalId(
    input: ApiV1StatisticsNationalIdBreakdownGetRequest,
  ): Promise<ProviderStatisticsBreakdownPaginationResponse | null> {
    const statistics = await this.api.apiV1StatisticsNationalIdBreakdownGet(
      input,
    )

    if (!statistics.totalCount) {
      return null
    }

    return statistics
  }

  async getStatisticsBreakdownWithCategoriesByNationalId(
    input: ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const statistics =
      await this.api.apiV1StatisticsNationalIdBreakdownCategoriesGet(input)

    if (!statistics.totalCount) {
      return null
    }

    return statistics
  }

  async getStatisticsBreakdownWithCategoriesByProviderId(
    input: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest,
  ): Promise<ProviderStatisticsCategoryBreakdownPaginationResponse | null> {
    const statistics =
      await this.api.apiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGet(
        input,
      )

    if (!statistics.totalCount) {
      return null
    }

    return statistics
  }
}
