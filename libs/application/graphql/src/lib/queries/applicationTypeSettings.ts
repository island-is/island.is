import { gql } from '@apollo/client'

export const GET_APPLICATION_TYPE_SETTINGS = gql`
  query GetApplicationTypeSettings($input: GetApplicationTypeSettingsInput!) {
    getApplicationTypeSettings(input: $input) {
      id
      applicationType
      alertBanner {
        id
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
