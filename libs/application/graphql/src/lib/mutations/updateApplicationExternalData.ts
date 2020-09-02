import { gql } from '@apollo/client'

export const UPDATE_APPLICATION_EXTERNAL_DATA = gql`
  mutation UpdateApplicationExternalData(
    $input: UpdateApplicationExternalDataInput!
  ) {
    updateApplicationExternalData(input: $input) {
      id
      externalData
    }
  }
`
