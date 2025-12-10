import { gql } from '@apollo/client'
import { FieldFragment } from './field'
import { LanguageFields } from './languageFields'

export const ScreenFragment = gql`
  fragment Screen on FormSystemScreen {
    id
    sectionId
    name {
      ...LanguageFields
    }
    displayOrder
    isHidden
    isCompleted
    multiset
    callRuleset
    fields {
      ...Field
    }
  }
  ${LanguageFields}
  ${FieldFragment}
`
