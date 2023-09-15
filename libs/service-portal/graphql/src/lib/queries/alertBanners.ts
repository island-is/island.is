import gql from 'graphql-tag'

export const GET_SERVICE_PORTAL_ALERT_BANNERS_QUERY = gql`
  query GetServicePortalAlertBanners(
    $input: GetServicePortalAlertBannersInput!
  ) {
    getServicePortalAlertBanners(input: $input) {
      showAlertBanner
      bannerVariant
      title
      description
      linkTitle
      link {
        slug
        type
      }
      isDismissable
      dismissedForDays
      servicePortalPaths
    }
  }
`
