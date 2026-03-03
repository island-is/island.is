import { gql } from '@apollo/client'

export const SUBMIT_APPLICATION = gql`
  mutation SubmitFormSystemApplication($input: FormSystemApplicationInput!) {
    submitFormSystemApplication(input: $input) {
      submissionFailed
      validationError {
        hasError
        title {
          is
          en
        }
        message {
          is
          en
        }
      }
    }
  }
`
