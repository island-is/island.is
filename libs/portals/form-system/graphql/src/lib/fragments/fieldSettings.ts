import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { ListItemFragment } from './listItem'

export const FieldSettingsFragment = gql`
  fragment FieldSettings on FormSystemFieldSettings {
    minValue
    maxValue
    minLength
    maxLength
    minDate
    maxDate
    minAmount
    maxAmount
    year
    hasLink
    url
    buttonText {
      ...LanguageFields
    }
    hasPropertyInput
    hasPropertyList
    list {
      ...ListItem
    }
    listType
    fileTypes
    fileMaxSize
    maxFiles
    timeInterval
    isLarge
    zendeskIsCustomField
    zendeskCustomFieldId
    applicantType
    hasDescription
  }
  ${ListItemFragment}
  ${LanguageFields}
`
