import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { FieldSettingsFragment } from './fieldSettings'
import { ListItemFragment } from './listItem'
import { ValueDtoFragment } from './value'

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
    list {
      ...ListItem
    }
    values {
      ...ValueDto
    }
    isRequired
    isHidden
    displayOrder
  }
  ${ValueDtoFragment}
  ${ListItemFragment}
  ${LanguageFields}
  ${FieldSettingsFragment}
`
