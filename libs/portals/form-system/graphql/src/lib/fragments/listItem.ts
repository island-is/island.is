import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const ListItemFragment = gql`
  fragment ListItem on ListItem {
    id
    label {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    value
    displayOrder
    isSelected
  }
  ${LanguageFields}
  `
