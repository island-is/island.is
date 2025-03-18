import { gql } from '@apollo/client'

export const GET_TRANSLATION = gql`
  query FormSystemGetTranslation($input: FormSystemGetTranslationInput!) {
    formSystemGetTranslation(input: $input) {
      translations
    }
  }
`
