import { gql } from '@apollo/client'

export const GET_TRANSLATION = gql`
  mutation FormSystemGetTranslation($input: FormSystemGetTranslationInput!) {
    formSystemGetTranslation(input: $input) {
      translations
  }
}
`
