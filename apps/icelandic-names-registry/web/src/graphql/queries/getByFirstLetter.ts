import { gql } from '@apollo/client'

export const GET_ICELANDIC_NAME_BY_INITIAL_LETTER = gql`
  query GetIcelandicNameByInitialLetter(
    $input: GetIcelandicNameByInitialLetterInput!
  ) {
    getIcelandicNameByInitialLetter(input: $input) {
      id
      icelandicName
      type
      status
      visible
      description
      url
    }
  }
`
