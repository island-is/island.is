import { gql } from '@apollo/client'

export const DELETE_APPLICATION = gql`
  mutation DeleteFormSystemApplication($input: String!) {
    deleteFormSystemApplication(input: $input)
  }
`
