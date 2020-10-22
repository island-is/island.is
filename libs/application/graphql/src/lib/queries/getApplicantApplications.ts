import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const APPLICANT_APPLICATIONS = gql`
  query GetApplicantApplications($input: GetApplicationsByUserInput!) {
    getApplicationsByApplicant(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
