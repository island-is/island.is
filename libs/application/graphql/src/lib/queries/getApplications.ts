import { gql } from '@apollo/client'

import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATIONS = gql`
  query GetApplications {
    getApplications {
      ...Application
    }
  }
  ${ApplicationFragment}
`
