// getRealEstateProperty.ts
import { gql } from '@apollo/client'

export const GET_REAL_ESTATE_PROPERTY = gql`
  query GetRealEstateProperty($input: GetRealEstateInput!) {
    assetsDetail(input: $input) {
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
  }
`
