import { gql } from '@apollo/client'

export const GET_CUSTOMER_CHARGETYPE = gql`
  query GetCustomerChargeTypeQuery {
    getCustomerChargeType {
      chargeType {
        id
        name
      }
    }
  }
`
