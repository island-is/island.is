import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const ApplicantFragment = gql`
  fragment Applicant on FormSystemApplicant {
    id
    description {
      ...LanguageFields
    }
    applicantTypeId
    name {
      ...LanguageFields
    }
    nameSuggestions {
      ...LanguageFields
    }
  }
  ${LanguageFields}
`
