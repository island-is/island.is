import { gql } from '@apollo/client'
import { FieldFragment } from './field'
import { LanguageFields } from './languageFields'

export const ScreenFragment = gql`
  fragment Screen on FormSystemScreen {
    id
    identifier
    sectionId
    name {
      ...LanguageFields
    }
    displayOrder
    isHidden
    isCompleted
    multiMax
    isMulti
    shouldValidate
    shouldPopulate
    screenError {
      hasError
      title {
        ...LanguageFields
      }
      message {
        ...LanguageFields
      }
    }
    fields {
      ...Field
    }
  }
  ${LanguageFields}
  ${FieldFragment}
`
