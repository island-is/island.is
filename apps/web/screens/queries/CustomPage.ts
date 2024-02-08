import gql from 'graphql-tag'

export const GET_CUSTOM_PAGE_QUERY = gql`
  query GetCustomPage($input: GetCustomPageInput!) {
    getCustomPage(input: $input) {
      configJson
      alertBanner {
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
      }
    }
  }
`
