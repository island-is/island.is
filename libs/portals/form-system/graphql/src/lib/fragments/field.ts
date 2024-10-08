import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { FieldSettingsFragment } from './fieldSettings'

export const FieldFragment = gql`
  fragment Field on FormSystemField {
    id
    screenId
    name {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    isPartOfMultiset
    fieldSettings {
      ...FieldSettings
    }
    fieldType
    isRequired
  }
  ${LanguageFields}
  ${FieldSettingsFragment}
`
