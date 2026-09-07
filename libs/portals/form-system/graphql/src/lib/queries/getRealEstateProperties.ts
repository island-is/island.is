import { gql } from '@apollo/client'

export const GET_REAL_ESTATE_PROPERTIES = gql`
  query GetRealEstateProperties($input: GetMultiPropertyInput!) {
    assetsOverview(input: $input) {
      properties {
        propertyNumber
        defaultAddress {
          locationNumber
          postNumber
          municipality
          propertyNumber
          display
          displayShort
        }
      }
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
    }
  }
`
