import { gql } from '@apollo/client'
import { FieldSettingsFragment } from './fieldSettings'
import { LanguageFields } from './languageFields'

export const FieldTypeFragment = gql`
  fragment FieldType on FormSystemFieldType {
    id
    type
    name {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    isCommon
    fieldSettings {
      ...FieldSettings
    }
    isRequired
  }
  ${LanguageFields}
  ${FieldSettingsFragment}
`
