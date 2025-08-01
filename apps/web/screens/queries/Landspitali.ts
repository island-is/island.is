import gql from 'graphql-tag'

export const CREATE_LANDSPITALI_MEMORIAL_CARD_PAYMENT_URL = gql`
  mutation CreateMemorialCardPaymentUrl(
    $input: CreateMemorialCardPaymentUrlInput!
  ) {
    webLandspitaliMemorialCardPaymentUrl(input: $input) {
      url
    }
  }
`

export const CREATE_LANDSPITALI_DIRECT_GRANT_PAYMENT_URL = gql`
  mutation CreateDirectGrantPaymentUrl(
    $input: CreateDirectGrantPaymentUrlInput!
  ) {
    webLandspitaliDirectGrantPaymentUrl(input: $input) {
      url
    }
  }
`
