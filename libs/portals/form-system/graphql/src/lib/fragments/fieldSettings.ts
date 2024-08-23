import { gql } from '@apollo/client'
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
    buttonText
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
  }
  ${ListItemFragment}
  `
