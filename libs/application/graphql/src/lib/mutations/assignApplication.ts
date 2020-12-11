import { gql } from '@apollo/client'

export const ASSIGN_APPLICATION = gql`
  mutation AssignApplication($input: AssignApplicationInput!) {
    assignApplication(input: $input)
  }
`
