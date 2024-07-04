import gql from 'graphql-tag'

export const GET_MULTIPLE_STATISTICS = gql`
  query GetMultipleStatistics($input: StatisticsQueryInput!) {
    getStatisticsByKeys(input: $input) {
      statistics {
        header
        statisticsForHeader {
          key
          value
        }
      }
    }
  }
`
