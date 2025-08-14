import gql from 'graphql-tag'

export const CREATE_LANDSPITALI_MEMORIAL_CARD_PAYMENT_URL = gql`
  mutation WebLandspitaliCreateMemorialCardPaymentUrl(
    $input: WebLandspitaliCreateMemorialCardPaymentUrlInput!
  ) {
    webLandspitaliMemorialCardPaymentUrl(input: $input) {
      url
    }
  }
`

export const CREATE_LANDSPITALI_DIRECT_GRANT_PAYMENT_URL = gql`
  mutation WebLandspitaliCreateDirectGrantPaymentUrl(
    $input: WebLandspitaliCreateDirectGrantPaymentUrlInput!
  ) {
    webLandspitaliDirectGrantPaymentUrl(input: $input) {
      url
    }
  }
`

export const GET_LANDSPITALI_CATALOG = gql`
  query WebLandspitaliCatalog {
    webLandspitaliCatalog {
      item {
        chargeType
        chargeItemCode
        chargeItemName
      }
    }
  }
`

export const SEND_LANDSPITALI_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL = gql`
  mutation WebLandspitaliSendDirectGrantPaymentConfirmationEmail(
    $input: WebLandspitaliDirectGrantPaymentConfirmationInput!
  ) {
    webLandspitaliSendDirectGrantPaymentConfirmationEmail(input: $input) {
      success
    }
  }
`

export const SEND_LANDSPITALI_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL = gql`
  mutation WebLandspitaliSendMemorialCardPaymentConfirmationEmail(
    $input: WebLandspitaliMemorialCardPaymentConfirmationInput!
  ) {
    webLandspitaliSendMemorialCardPaymentConfirmationEmail(input: $input) {
      success
    }
  }
`
