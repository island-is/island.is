import { gql } from '@apollo/client'

export const UPDATE_SCREEN = gql`
  mutation UpdateFormSystemScreen($input: FormSystemUpdateScreenInput!) {
    updateFormSystemScreen(input: $input) {
      ...Screen
    }
  }
`
