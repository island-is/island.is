import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const ApplicantFragment = gql`
  fragment Applicant on FormSystemFormApplicant {
    id
    applicantType
    name {
      ...LanguageFields
    }
  }
  ${LanguageFields}
`
