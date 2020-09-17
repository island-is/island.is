import gql from 'graphql-tag'

export const GET_ALERT_BANNER_QUERY = gql`
  query GetAlertBanner($input: GetAlertBannerInput!) {
    getAlertBanner(input: $input) {
      showAlertBanner
      bannerVariant
      title
      description
      link {
        text
        url
      }
      isDismissable
      dismissedForDays
    }
  }
`
