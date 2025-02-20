import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const ApplicantFragment = gql`
  fragment Applicant on FormSystemFormApplicantType {
    id
    applicantTypeId
    name {
      ...LanguageFields
    }
  }
  ${LanguageFields}
`
