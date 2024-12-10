import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'
import { FormFragment } from './form'

export const OrganizationFragment = gql`
  fragment Organization on FormSystemOrganization {
    id
    name {
      ...LanguageFields
    }
    nationalId
    forms {
      ...Form
    }
  }
  ${LanguageFields}
  ${FormFragment}
`
