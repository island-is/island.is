import { gql } from '@apollo/client'

export const UPDATE_ISLYKILL_SETTINGS = gql`
  mutation updateIslykillSettings($input: UpdateIslykillSettingsInput!) {
    updateIslykillSettings(input: $input) {
      nationalId
    }
  }
`
