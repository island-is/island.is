import { gql } from '@apollo/client'

export const SUBMIT_APPLICATION = gql`
  mutation SubmitFormSystemApplication($input: FormSystemApplicationInput!) {
    submitFormSystemApplication(input: $input) {
      success
      screenErrorMessages {
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
