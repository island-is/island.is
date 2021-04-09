import { gql } from '@apollo/client'

export const UPDATE_ICELANDIC_NAME = gql`
  mutation updateIcelandicName($input: UpdateIcelandicNameInput!) {
    updateIcelandicName(input: $input) {
      icelandic_name
    }
  }
`
