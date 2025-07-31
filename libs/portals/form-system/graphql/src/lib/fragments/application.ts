import { gql } from '@apollo/client'
import { SectionFragment } from './section'
import { LanguageFields } from './languageFields'
import { ApplicantTypeDtoFragment } from './applicant'

export const ApplicationFragment = gql`
  fragment Application on FormSystemApplication {
    id
    organizationName {
      ...LanguageFields
    }
    formId
    formName {
      ...LanguageFields
    }
    isTest
    slug
    sections {
      ...Section
    }
    status
    stopProgressOnValidatingScreen
    certificationTypes {
      id
      certificationTypeId
    }
    applicantTypes {
      ...ApplicantTypeDto
    }
    modified
    submittedAt
    completed
  }
  ${ApplicantTypeDtoFragment}
  ${LanguageFields}
  ${SectionFragment}
`
