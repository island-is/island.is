import { gql } from '@apollo/client'

export const DELETE_FIELD = gql`
  mutation DeleteField($input: FormSystemDeleteFieldInput!) {
    deleteField(input: $input)
  }
`
