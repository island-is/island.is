import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const APPLICATION_APPLICATION = gql`
  query ApplicationApplication($input: ApplicationApplicationInput!) {
    applicationApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
