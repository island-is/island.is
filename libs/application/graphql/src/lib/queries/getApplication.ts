import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATION = gql`
  query GetApplication($input: GetApplicationInput!) {
    getApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
