import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATIONS = gql`
  query FormSystemGetApplications($input: FormSystemGetAllApplicationsInput!) {
    formSystemGetApplications(input: $input) {
      applications {
        ...Application
      }
      total
    }
  }
  ${ApplicationFragment}
`
