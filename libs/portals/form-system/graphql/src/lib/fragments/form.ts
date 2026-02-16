import { gql } from '@apollo/client'
import { CompletedSectionInfoFragment } from './completedSectionInfo'
import { DependencyFragment } from './dependency'
import { FieldFragment } from './field'
import { FormApplicantFragment } from './formApplicant'
import { LanguageFields } from './languageFields'
import { ScreenFragment } from './screen'
import { SectionFragment } from './section'

export const FormFragment = gql`
  fragment Form on FormSystemForm {
    id
    organizationId
    organizationNationalId
    organizationTitle
    organizationTitleEn
    organizationDisplayName {
      ...LanguageFields
    }
    name {
      ...LanguageFields
    }
    slug
    invalidationDate
    created
    modified
    zendeskInternal
    submissionServiceUrl
    isTranslated
    hasPayment
    beenPublished
    daysUntilApplicationPrune
    derivedFrom
    allowProceedOnValidationFail
    hasSummaryScreen
    completedSectionInfo {
      ...CompletedSectionInfo
    }
    certificationTypes {
      id
      certificationTypeId
    }
    applicantTypes {
      ...FormApplicant
    }
    sections {
      ...Section
    }
    screens {
      ...Screen
    }
    fields {
      ...Field
    }
    dependencies {
      ...Dependency
    }
    status
  }
  ${LanguageFields}
  ${FormApplicantFragment}
  ${SectionFragment}
  ${ScreenFragment}
  ${FieldFragment}
  ${DependencyFragment}
  ${CompletedSectionInfoFragment}
`
