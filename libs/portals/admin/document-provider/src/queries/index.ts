import { gql } from '@apollo/client'

export const GET_STATISTIC_PROVIDERS_BY_NATIONALID = gql`
  query StatisticProvidersByNationalId(
    $input: DocumentProviderDashboardGetStatisticsProvidersNationalId!
  ) {
    statisticProvidersByNationalId(input: $input) {
      totalCount
      items {
        providerId
        name
        statistics {
          published
          notifications
          opened
          failures
        }
      }
    }
  }
`

export const GET_STATISTIC_PROVIDER_CATEGORIES_BY_NATIONALID = gql`
  query StatisticProviderCategoriesByNationalId(
    $input: DocumentProviderDashboardGetStatisticsCategoriesByNationalId!
  ) {
    statisticsCategories(input: $input) {
      name
      published
    }
  }
`

export const GET_STATISTICS_BY_NATIONALID = gql`
  query StatisticsByNationalId(
    $input: DocumentProviderDashboardGetStatisticsByNationalId!
  ) {
    statisticsByNationalId(input: $input) {
      providerCount
      statistics {
        published
        notifications
        opened
        failures
      }
    }
  }
`

export const GET_PROVIDER_STATISTICS_BREAKDOWN_BY_PROVIDERID = gql`
  query ProviderStatisticsBreakdownByProviderId(
    $input: DocumentProviderDashboardGetStatisticsBreakdownByProviderId!
  ) {
    statisticsBreakdownByProviderId(input: $input) {
      totalCount
      items {
        year
        month
        statistics {
          published
          notifications
          opened
          failures
        }
      }
    }
  }
`

export const GET_PROVIDER_STATISTICS_BREAKDOWN_WITH_CATEGORY_BY_PROVIDERID = gql`
  query ProviderStatisticsBreakdownWithCategoriesByProviderId(
    $input: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByProviderId!
  ) {
    statisticsBreakdownWithCategoriesByProviderId(input: $input) {
      totalCount
      items {
        year
        month
        categoryStatistics {
          name
          published
        }
      }
    }
  }
`

export const GET_PROVIDER_STATISTICS_BREAKDOWN_WITH_CATEGORY_BY_NATIONALID = gql`
  query ProviderStatisticsBreakdownWithCategoriesByNationalId(
    $input: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId!
  ) {
    statisticsBreakdownWithCategoriesByNationalId(input: $input) {
      totalCount
      items {
        year
        month
        categoryStatistics {
          name
          published
        }
      }
    }
  }
`

export const GET_PROVIDER_STATISTICS_BREAKDOWN_BY_NATIONALID = gql`
  query ProviderStatisticsBreakdownByNationalId(
    $input: DocumentProviderDashboardGetStatisticsBreakdownByNationalId!
  ) {
    statisticsBreakdownByNationalId(input: $input) {
      totalCount
      items {
        year
        month
        statistics {
          published
          notifications
          opened
          failures
        }
      }
    }
  }
`

export const GET_STATISTICS_OVERVIEW_BY_PROVIDERID = gql`
  query StatisticsOverviewByProviderId(
    $input: DocumentProviderDashboardGetStatisticsCategoriesByProviderId!
  ) {
    statisticsOverviewByProviderId(input: $input) {
      name
      statistics {
        published
        notifications
        opened
        failures
      }
    }
  }
`
