import { gql } from '@apollo/client'

export const LanguageFields = gql`
  fragment LanguageFields on FormSystemLanguageType {
    is
    en
  }
`
