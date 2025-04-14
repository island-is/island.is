import { gql } from '@apollo/client'

export const DELETE_SCREEN = gql`
  mutation DeleteFormSystemScreen($input: FormSystemDeleteScreenInput!) {
    deleteFormSystemScreen(input: $input)
  }
`
