import { gql } from '@apollo/client'

export const DELETE_SCREEN = gql`
  mutation FormSystemDeleteScreen($input: FormSystemDeleteScreenInput!) {
    formSystemDeleteScreen(input: $input)
  }
`
