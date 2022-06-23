import { gql } from '@apollo/client'

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($input: DeleteApplicationInput!) {
    deleteApplication(input: $input) {
      id
    }
  }
`
