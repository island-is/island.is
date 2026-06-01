import { gql } from '@apollo/client'
import { ApplicantTypeDtoFragment } from './applicant'
import { LanguageFields } from './languageFields'
import { SectionFragment } from './section'
import { SectionInfoFragment } from './sectionInfo'

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
    draftFinishedSteps
    draftTotalSteps
    allowProceedOnValidationFail
    submissionServiceUrl
    hasPayment
    hasSummaryScreen
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
    dependencies {
      parentProp
      childProps
      isSelected
    }
    sectionInfo {
      ...SectionInfo
    }
    organizationNationalId
  }
  ${ApplicantTypeDtoFragment}
  ${LanguageFields}
  ${SectionFragment}
  ${SectionInfoFragment}
`
