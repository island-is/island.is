import { gql } from '@apollo/client'

export const GET_PAYMENT_CATALOG = gql`
  query PaymentCatalog($input: PaymentCatalogInput!) {
    paymentCatalog(input: $input) {
      items {
        performingOrgID
        chargeType
        chargeItemCode
        chargeItemName
        priceAmount
      }
    }
  }
`
