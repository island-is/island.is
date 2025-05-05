import { gql } from '@apollo/client'

export const DELETE_FIELD = gql`
  mutation DeleteFormSystemFieldField($input: FormSystemDeleteFieldInput!) {
    deleteFormSystemField(input: $input)
  }
`
