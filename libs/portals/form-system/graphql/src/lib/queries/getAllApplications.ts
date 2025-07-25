import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_ALL_APPLICATIONS = gql`
  query FormSystemGetApplications($input: FormSystemGetApplicationsInput!) {
    formSystemGetApplications(input: $input) {
      applications {
        ...Application
      }
      organizations {
        label
        value
        isSelected
      }
      total
    }
  }
  ${ApplicationFragment}
`
