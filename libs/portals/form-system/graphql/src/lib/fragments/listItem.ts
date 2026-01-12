import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const ListItemFragment = gql`
  fragment ListItem on FormSystemListItem {
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
