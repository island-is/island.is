import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const FormApplicantFragment = gql`
  fragment FormApplicant on FormSystemFormApplicant {
    id
    applicantType
    name {
      ...LanguageFields
    }
  }
  ${LanguageFields}
`
