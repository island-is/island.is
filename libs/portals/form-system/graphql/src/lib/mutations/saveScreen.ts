import { gql } from '@apollo/client'

export const SAVE_SCREEN = gql`
  mutation SaveFormSystemScreen($input: SubmitFormSystemScreenInput!) {
    saveFormSystemScreen(input: $input)
  }
`
