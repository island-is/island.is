import { gql } from '@apollo/client'

export const GET_GOOGLE_TRANSLATION = gql`
  mutation FormSystemGoogleTranslation(
    $input: FormSystemGoogleTranslationInput!
  ) {
    formSystemGoogleTranslation(input: $input) {
      translation
    }
  }
`
