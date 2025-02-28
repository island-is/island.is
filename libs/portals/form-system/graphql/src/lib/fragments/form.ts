import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
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
    urls {
      id
      organizationUrlId
      url
      isXroad
      isTest
      type
      method
    }
  }
  ${LanguageFields}
  ${FormApplicantFragment}
  ${SectionFragment}
  ${ScreenFragment}
  ${FieldFragment}
  ${DependencyFragment}
`
