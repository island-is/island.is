import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const APPLICATION_APPLICATION = gql`
  query ApplicationApplication(
    $input: ApplicationApplicationInput!
    $locale: String!
  ) {
    applicationApplication(input: $input, locale: $locale) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
