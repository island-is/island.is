import { gql } from '@apollo/client'

export const UPDATE_APPLICATION_EXTERNAL_DATA = gql`
  mutation UpdateApplicationExternalData(
    $input: UpdateApplicationExternalDataInput!
    $locale: String!
  ) {
    updateApplicationExternalData(input: $input, locale: $locale) {
      id
      externalData
    }
  }
`
