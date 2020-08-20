import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATIONS_BY_TYPE = gql`
  query GetApplicationsByType($input: GetApplicationsByTypeInput!) {
    getApplicationsByType(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
