import { gql } from '@apollo/client'

export const UPDATE_SCREEN = gql`
  mutation FormSystemUpdateScreen($input: FormSystemUpdateScreenInput!) {
    formSystemUpdateScreen(input: $input)
  }
`
