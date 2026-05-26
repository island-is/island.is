import { gql } from '@apollo/client'
import { DependencyFragment } from './dependency'
import { FieldFragment } from './field'
import { FormApplicantFragment } from './formApplicant'
import { LanguageFields } from './languageFields'
import { ScreenFragment } from './screen'
import { SectionFragment } from './section'
import { SectionInfoFragment } from './sectionInfo'

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
    useValidate
    submissionServiceUrl
    isTranslated
    hasPayment
    beenPublished
    draftDaysToLive
    submissionDaysToLive
    derivedFrom
    allowProceedOnValidationFail
    hasSummaryScreen
    organizationZendeskInstance {
      zendeskInstance
      zendeskBrandId
    }
    sectionInfo {
      ...SectionInfo
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
    lastModifiedBy
  }
  ${LanguageFields}
  ${FormApplicantFragment}
  ${SectionFragment}
  ${ScreenFragment}
  ${FieldFragment}
  ${DependencyFragment}
  ${SectionInfoFragment}
`
