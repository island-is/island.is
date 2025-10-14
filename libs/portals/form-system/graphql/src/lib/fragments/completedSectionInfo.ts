import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const CompletedSectionInfoFragment = gql`
  fragment CompletedSectionInfo on FormSystemCompletedSectionInfo {
    title {
      ...LanguageFields
    }
    confirmationHeader {
      ...LanguageFields
    }
    confirmationText {
      ...LanguageFields
    }
    additionalInfo {
      ...LanguageFields
    }
  }
  ${LanguageFields}
`
