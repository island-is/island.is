import { gql } from '@apollo/client'
import { SectionFragment } from './section'
import { LanguageFields } from './languageFields'
import { DependencyFragment } from './dependency'

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
    created
    modified
    submittedAt
    dependencies {
      ...Dependency
    }
    sections {
      ...Section
    }
    completed
    status
  }
  ${LanguageFields}
  ${SectionFragment}
  ${DependencyFragment}
`
