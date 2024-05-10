import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_CUSTOM_PAGE_QUERY = gql`
  query GetCustomPage($input: GetCustomPageInput!) {
    getCustomPage(input: $input) {
      configJson
      translationStrings
      content {
        ...AllSlices
        ${nestedFields}
      }
      ogTitle
      ogDescription
      ogImage {
        ...ImageFields
      }
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
  ${slices}
`
