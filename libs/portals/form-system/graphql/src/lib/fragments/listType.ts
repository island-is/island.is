import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const ListTypeFragment = gql`
  fragment ListType on FormSystemListType {
    id
    name {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    type
    isCommon
  }
  ${LanguageFields}
`
