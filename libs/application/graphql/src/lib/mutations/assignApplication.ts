import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const ASSIGN_APPLICATION = gql`
  mutation AssignApplication($input: AssignApplicationInput!) {
    assignApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
