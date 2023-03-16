import gql from 'graphql-tag'

export const GET_STATISTICS = gql`
  query consultationPortalStatistics {
    consultationPortalStatistics {
      totalCases
      totalAdvices
      casesInReview
    }
  }
`
