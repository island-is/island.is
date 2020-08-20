import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
