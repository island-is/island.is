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
