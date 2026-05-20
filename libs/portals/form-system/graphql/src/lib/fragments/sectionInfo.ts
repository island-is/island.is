import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const SectionInfoFragment = gql`
  fragment SectionInfo on FormSystemSectionInfo {
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
