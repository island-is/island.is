import { gql } from '@apollo/client'

export const SUBMIT_APPLICATION = gql`
  mutation SubmitApplication($input: SubmitApplicationInput!) {
    submitApplication(input: $input)
  }
`
