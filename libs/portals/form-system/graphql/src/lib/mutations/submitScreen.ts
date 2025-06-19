import { gql } from '@apollo/client'

export const SUBMIT_SCREEN = gql`
  mutation SubmitFormSystemScreen($input: SubmitFormSystemScreenInput!) {
    submitFormSystemScreen(input: $input) {
      isValid
    }
  }
`
