import { gql } from '@apollo/client'

export { SUBMIT_APPLICATION } from '@island.is/application/graphql'

export const PAYMENT_STATUS = gql`
  query status($applicationId: String!) {
    applicationPaymentStatus(applicationId: $applicationId) {
      fulfilled
    }
  }
`
