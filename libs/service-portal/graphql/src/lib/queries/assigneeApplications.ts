import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const ASSIGNEE_APPLICATIONS = gql`
  query GetAssigneeApplications($input: GetApplicationsByUserInput!) {
    getApplicationsByAssignee(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
