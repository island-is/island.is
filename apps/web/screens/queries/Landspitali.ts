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

export const GET_LANDSPITALI_MENU = gql`
  query WebLandspitaliMenu($selectedDate: String) {
    webLandspitaliMenu(selectedDate: $selectedDate) {
      meals {
        name
        date
        dateDescription
        holidayName
        lang
        description
        order
        distributor {
          id
          name
        }
        courses {
          id
          name
          optionName
          description
          order
          labelOfContents
          ingredients {
            name
          }
          nutrients {
            name
            amount
            unit
          }
          prices {
            name
            value
            currency
          }
          co2Equivalents
          knownAllergens {
            name
            presenceLevel
          }
        }
      }
    }
  }
`
