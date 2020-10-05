import { gql } from '@apollo/client'

export const LIST_APPLICATIONS = gql`
  query GetApplications($input: GetApplicationsByUserInput!) {
    getApplicationsByApplicant(input: $input) {
      id
      created
      modified
      applicant
      assignee
      externalId
      state
      typeId
      name
      progress
    }
  }
`
