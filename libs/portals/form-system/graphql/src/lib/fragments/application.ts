import { gql } from '@apollo/client'
import { ApplicantTypeDtoFragment } from './applicant'
import { CompletedSectionInfoFragment } from './completedSectionInfo'
import { LanguageFields } from './languageFields'
import { SectionFragment } from './section'

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
    completedSectionInfo {
      ...CompletedSectionInfo
    }
  }
  ${ApplicantTypeDtoFragment}
  ${LanguageFields}
  ${SectionFragment}
  ${CompletedSectionInfoFragment}
`
