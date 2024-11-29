import { gql } from '@apollo/client'
import { OrganizationFragment } from './organization'
import { SectionFragment } from './section'

export const ApplicationFragment = gql`
  fragment Application on FormSystemApplication {
    id
    organization {
      ...Organization
    }
    formId
    slug
    created
    modified
    sections {
      ...Section
    }
  }
  ${OrganizationFragment}
  ${SectionFragment}
`
