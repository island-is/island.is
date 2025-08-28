import { gql } from '@apollo/client'
import { ListItemFragment } from './listItem'
import { LanguageFields } from './languageFields'

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
    zendeskIsPublic
    zendeskIsCustomField
    zendeskCustomFieldId
    applicantType
  }
  ${ListItemFragment}
  ${LanguageFields}
`
