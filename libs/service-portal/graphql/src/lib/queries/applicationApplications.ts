import { gql } from '@apollo/client'

import { ApplicationFragment } from '../fragments/application'

export const APPLICATION_APPLICATIONS = gql`
  query ApplicationApplications(
    $input: ApplicationApplicationsInput
    $locale: String!
  ) {
    applicationApplications(input: $input, locale: $locale) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
