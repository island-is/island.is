import { gql } from '@apollo/client'
import { addressFragment, pagingFragment } from '../fragments/assets'

export const GET_REAL_ESTATE = gql`
  query GetRealEstateQuery($input: GetMultiPropertyInput!) {
    assetsOverview(input: $input) {
      properties {
        propertyNumber
        defaultAddress {
          ...Address
        }
      }
      paging {
        ...Paging
      }
    }
  }
  ${pagingFragment}
  ${addressFragment}
`
