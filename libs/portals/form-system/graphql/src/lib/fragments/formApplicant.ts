import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const FormApplicantFragment = gql`
  fragment FormApplicant on FormSystemFormApplicantType {
    id
    applicantTypeId
    name {
      ...LanguageFields
    }
  }
  ${LanguageFields}
`
