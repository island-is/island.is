import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { CertificateTypeFragment } from './certificateType'
import { ApplicantFragment } from './applicant'
import { FieldFragment } from './field'
import { ScreenFragment } from './screen'
import { SectionFragment } from './section'

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
      ...CertificationType
    }
    applicants {
      ...Applicant
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
    dependencies
  }
  ${LanguageFields}
  ${CertificateTypeFragment}
  ${ApplicantFragment}
  ${SectionFragment}
  ${ScreenFragment}
  ${FieldFragment}
`
