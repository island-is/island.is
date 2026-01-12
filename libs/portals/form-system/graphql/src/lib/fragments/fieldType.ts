import { gql } from '@apollo/client'
import { FieldSettingsFragment } from './fieldSettings'
import { LanguageFields } from './languageFields'

export const FieldTypeFragment = gql`
  fragment FieldType on FormSystemFieldType {
    id
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
    values {
      ...Value
    }
  }
  ${LanguageFields}
  ${FieldSettingsFragment}
`
