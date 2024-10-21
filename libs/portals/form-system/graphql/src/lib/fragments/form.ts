import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { CertificateTypeFragment } from './certificateType'
import { FieldFragment } from './field'
import { ScreenFragment } from './screen'
import { SectionFragment } from './section'
import { DependencyFragment } from './dependency'
import { FormApplicantFragment } from './formApplicant'

export const FormFragment = gql`
  fragment Form on FormSystemForm {
    id
    organizationId
    name {
      ...LanguageFields
    }
    slug
    invalidationDate
    created
    modified
    isTranslated
    applicationDaysToRemove
    derivedFrom
    stopProgressOnValidatingScreen
    completedMessage {
      ...LanguageFields
    }
    certificationTypes {
      ...CertificateType
    }
    applicants {
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
  }
  ${LanguageFields}
  ${CertificateTypeFragment}
  ${FormApplicantFragment}
  ${SectionFragment}
  ${ScreenFragment}
  ${FieldFragment}
  ${DependencyFragment}
`
