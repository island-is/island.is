import { gql } from '@apollo/client'

export const UPDATE_FIELD = gql`
  mutation FormSystemUpdateField($input: FormSystemUpdateFieldInput!) {
    formSystemUpdateField(input: $input)
  }
`
