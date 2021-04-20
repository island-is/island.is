import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication(
    $input: UpdateApplicationInput!
    $locale: String!
  ) {
    updateApplication(input: $input, locale: $locale) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
