import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { ScreenFragment } from './screen'

export const SectionFragment = gql`
  fragment Section on FormSystemSection {
    id
    identifier
    name {
      ...LanguageFields
    }
    displayOrder
    isHidden
    isCompleted
    screens {
      ...Screen
    }
    sectionType
  }
  ${LanguageFields}
  ${ScreenFragment}
`
